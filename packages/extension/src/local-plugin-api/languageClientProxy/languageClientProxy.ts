import * as vscode from 'vscode'
import {
  Code2ProtocolConverter,
  LanguageClientOptions,
  TransportKind,
  LanguageClient,
  RequestType,
  ServerOptions,
  DocumentFilter,
} from 'vscode-languageclient'
import { constants } from '../../constants'

type VslSendRequest = <P, R, E, RO>(
  type: RequestType<P, R, E, RO>,
  params: P
) => Thenable<R>

export interface LanguageClientProxy {
  readonly code2ProtocolConverter: Code2ProtocolConverter
  readonly sendRequest: VslSendRequest
}

const clientOptions: LanguageClientOptions = {
  documentSelector: [
    {
      scheme: 'file',
    },
  ],
}

export const createLanguageClientProxy = async (
  context: vscode.ExtensionContext
): Promise<LanguageClientProxy> => {
  const serverModule = context.asAbsolutePath('../server/dist/serverMain.js')
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

  return {
    code2ProtocolConverter: languageClient.code2ProtocolConverter,
    sendRequest: async (type, params) =>
      languageClient.sendRequest(type, params),
  }
}
