import * as vscode from 'vscode'
import {
  Code2ProtocolConverter,
  LanguageClientOptions,
  TransportKind,
  LanguageClient,
  RequestType,
  ErrorCodes,
  ServerOptions,
  DocumentFilter,
} from 'vscode-languageclient'
import { constants } from '../../constants'

// const defaultTimeout = 3 // for self closing tag
// const defaultTimeout = 40 // for expand abbreviation
// const defaultTimeout = 45 // normal files
// const defaultTimeout = 100 // large files
// const defaultTimeout = 350 // very large files
// const defaultTimeout = 1000 // for html spec

// class TimeoutError extends Error {}

// /**
//  * Rejects a promise after a certain amount of milliseconds
//  *
//  * @param promise - the promise to time out
//  * @param timeout - timeout in milliseconds
//  */
// const timeout: <T>(promise: Promise<T>, timeout: number) => Promise<T> = (
//   promise,
//   timeout
// ) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => reject(new TimeoutError()), timeout)
//     promise.then(resolve).catch(reject)
//   })
// }

// const withTimeout: (
//   sendRequest: LocalPluginApi['languageClient']['sendRequest']
// ) => LocalPluginApi['languageClient']['sendRequest'] = sendRequest => {
//   return (type, params, token) => {
//     const combinedTokenSource = new vsl.CancellationTokenSource()
//     if (token) {
//       token.onCancellationRequested(() => {
//         combinedTokenSource.cancel()
//       })
//     }
//     const timeoutTokenSource = new vsl.CancellationTokenSource()
//     timeoutTokenSource.token.onCancellationRequested(() => {
//       combinedTokenSource.cancel()
//     })
//     const promise = languageClient.sendRequest(
//       type,
//       params,
//       combinedTokenSource.token
//     ) as Promise<any>
//     try {
//       return await timeout(promise, defaultTimeout)
//     } catch (error) {
//       if (error instanceof TimeoutError) {
//         timeoutTokenSource.cancel()
//         vscode.window.showWarningMessage(
//           `Performance Violation: Request for ${type.method} took longer than ${defaultTimeout}ms`
//         )
//       } else {
//         vscode.window.showWarningMessage(JSON.stringify(error))
//       }
//       return undefined
//     }
//   }
// }

type VslSendRequest = <P, R, E, RO>(
  type: RequestType<P, R, E, RO>,
  params: P,
  token?: vscode.CancellationToken
) => Thenable<R>

export interface LanguageClientProxy {
  readonly code2ProtocolConverter: Code2ProtocolConverter
  readonly sendRequest: VslSendRequest
}

const documentSelector: DocumentFilter[] = constants.allowedLanguageIds.map(
  languageId => ({
    language: languageId,
    scheme: 'file',
  })
)

const clientOptions: LanguageClientOptions = {
  documentSelector,
}

export const createLanguageClientProxy = async (
  context: vscode.ExtensionContext
): Promise<LanguageClientProxy> => {
  const serverModule = context.asAbsolutePath(
    '../html-missing-features-server/dist/htmlMissingFeaturesServerMain.js'
  )
  // If the extension is launch in debug mode the debug server options are use
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ['--nolazy', '--inspect=6009'] },
    },
  }

  // // // // // // // // \\ \\ \\ \\ \\ \\ \\
  // // // // //                \\ \\ \\ \\ \\
  // // // //                      \\ \\ \\ \\
  // // //        Begin Debug         \\ \\ \\
  // //                                  \\ \\
  //                                        \\
  if (true) {
    const streamLogs = true
    if (streamLogs) {
      // eslint-disable-next-line global-require

      const WebSocket = require('ws')
      let socket: import('ws') | undefined
      const port = vscode.workspace
        .getConfiguration('htmlMissingFeaturesClient')
        .get('port', 7000)

      context.subscriptions.push(
        vscode.commands.registerCommand(
          'htmlMissingFeatures.startStreamingLogs',
          () => {
            // Establish websocket connection
            socket = new WebSocket(`ws://localhost:${port}`)
          }
        )
      )

      // The log to send
      let log = ''
      const websocketOutputChannel: vscode.OutputChannel = {
        name: 'websocket',
        // Only append the logs but send them later
        append(value: string) {
          log += value
        },
        appendLine(value: string) {
          try {
            const message = JSON.parse(value)
            if (!message.isLSPMessage) {
              console.log(message)
            }
          } catch (error) {
            if (typeof value !== 'object') {
              console.log(value)
            }
          }
          log += value
          // Don't send logs until WebSocket initialization
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(log)
          }
          log = ''
        },
        clear() {},
        show() {},
        hide() {},
        dispose() {},
      }
      clientOptions.outputChannel = websocketOutputChannel
    } else {
      const consoleChannel: vscode.OutputChannel = {
        name: 'websocket',
        append() {},
        appendLine(value: string) {
          try {
            const message = JSON.parse(value)
            if (!message.isLSPMessage) {
              console.log(message)
            }
          } catch (error) {
            if (typeof value !== 'object') {
              console.log(value)
            }
          }
        },
        clear() {},
        show() {},
        hide() {},
        dispose() {},
      }
      clientOptions.outputChannel = consoleChannel
    }
  } else {
    const productionOutputChannel: vscode.OutputChannel = vscode.window.createOutputChannel(
      'htmlLanguageClient'
    )
    clientOptions.outputChannel = {
      name: productionOutputChannel.name,
      append() {},
      appendLine(value: string) {
        try {
          const message = JSON.parse(value)
          if (!message.isLSPMessage) {
            productionOutputChannel.appendLine(value)
          }
        } catch (error) {
          if (typeof value !== 'object') {
            productionOutputChannel.appendLine(value)
          }
        }
      },
      clear() {
        productionOutputChannel.clear()
      },
      show() {
        productionOutputChannel.show()
      },
      hide() {
        productionOutputChannel.hide()
      },
      dispose() {
        productionOutputChannel.dispose()
      },
    }
  }
  //                                        \\
  // //                                  \\ \\
  // // //          End Debug         \\ \\ \\
  // // // //                      \\ \\ \\ \\
  // // // // //                \\ \\ \\ \\ \\
  // // // // // // // // \\ \\ \\ \\ \\ \\ \\

  const languageClient = new LanguageClient(
    'htmlMissingFeaturesClient',
    'HTML Missing Features Client',
    serverOptions,
    clientOptions
  )
  context.subscriptions.push(languageClient.start())
  await languageClient.onReady()

  // const autoDispose: <Fn extends (...args: any[]) => vscode.Disposable>(
  //   fn: Fn
  // ) => (...args: Parameters<Fn>) => void = fn => (...args) => {
  //   context.subscriptions.push(fn(...args))
  // }

  return {
    code2ProtocolConverter: languageClient.code2ProtocolConverter,
    sendRequest: async (
      type,
      params,
      token = new vscode.CancellationTokenSource().token
    ) => {
      try {
        return await languageClient.sendRequest(type, params, token)
      } catch (error) {
        if (error.code && error.code === ErrorCodes.RequestCancelled) {
          // console.log('request cancelled')
          return undefined
        }
        console.error(error)
        return undefined
      }
    },
  }

  // const api: LocalPluginApi = {
  //   vscode: {
  //     window: {
  //       onDidChangeTextEditorSelection: autoDispose(
  //         vscode.window.onDidChangeTextEditorSelection
  //       ),
  //     },
  //     workspace: {
  //       onDidChangeTextDocument: autoDispose(
  //         vscode.workspace.onDidChangeTextDocument
  //       ),
  //     },
  //     commands: {
  //       registerTextEditorCommand: autoDispose(
  //         vscode.commands.registerTextEditorCommand
  //       ),
  //     },
  //   },
  //   languageClient: {
  //     code2ProtocolConverter: languageClient.code2ProtocolConverter,
  //     sendRequest: async (
  //       type,
  //       params,
  //       token = new vsl.CancellationTokenSource().token
  //     ) => {
  //       try {
  //         return await languageClient.sendRequest(type, params, token)
  //       } catch (error) {
  //         if (error.code && error.code === vsl.ErrorCodes.RequestCancelled) {
  //           // console.log('request cancelled')
  //           return undefined
  //         }
  //         console.error(error)
  //         return undefined
  //       }
  //     },
  //   },
  // }

  // return {
  //   registerLocalPlugin: plugin => {
  //     plugin(api)
  //   },
  // }
}
