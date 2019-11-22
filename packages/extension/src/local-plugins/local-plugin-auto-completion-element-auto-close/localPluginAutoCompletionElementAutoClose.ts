// import * as vscode from 'vscode'
// import { LocalPluginApi } from '../../local-plugin-api/localPluginApi'
// import { LocalPlugin } from '../localPlugin'
// import { RequestType, TextDocumentPositionParams } from 'vscode-languageclient'
// import { constants } from '../../constants'

// // TODO use optional chaining once prettier works with that

// type Result = {
//   completionString: string
//   completionOffset: number
// }

// const requestType = new RequestType<
//   TextDocumentPositionParams,
//   Result,
//   any,
//   any
// >('html-missing-features/auto-completion-element-auto-close')

// const askServerForAutoCompletionElementAutoClose: (
//   api: LocalPluginApi,
//   document: vscode.TextDocument,
//   position: vscode.Position
// ) => Promise<Result> = async (api, document, position) => {
//   // console.log(
//   //   'ask server' +
//   //     document.version +
//   //     'oo' +
//   //     document.offsetAt(position) +
//   //     document.getText()
//   // )
//   const params = api.languageClientProxy.code2ProtocolConverter.asTextDocumentPositionParams(
//     document,
//     position
//   )
//   const result = await api.languageClientProxy.sendRequest(requestType, params)
//   if (
//     !vscode.window.activeTextEditor ||
//     vscode.window.activeTextEditor.document.version !== document.version
//   ) {
//     throw new Error('too slow')
//   }
//   // console.log('not too slow')
//   return result
// }

// const applyResults: (
//   results: (Result | undefined)[]
// ) => Promise<void> = async results => {
//   // console.log(
//   //   'apply result' +
//   //     vscode.window.activeTextEditor.document.version +
//   //     JSON.stringify(results)
//   // )
//   const document = vscode.window.activeTextEditor.document
//   const relevantResults = results.filter(Boolean).map(result => {
//     const startPosition = document.positionAt(result.completionOffset)
//     const endPosition = document.positionAt(result.completionOffset)
//     return {
//       range: new vscode.Range(startPosition, endPosition),
//       word: result.completionString,
//     }
//   })
//   if (relevantResults.length === 0) {
//     return
//   }
//   const firstResult = relevantResults[0]
//   const isSameWordForEveryResult = relevantResults.every(
//     ({ word }) => word === firstResult.word
//   )
//   if (isSameWordForEveryResult) {
//     if (relevantResults.length === 1) {
//       // console.log('one')
//       // console.log(vscode.window.activeTextEditor.document.getText())
//       // await new Promise(r => setTimeout(r, 1000))
//       await vscode.window.activeTextEditor.insertSnippet(
//         new vscode.SnippetString(firstResult.word),
//         firstResult.range
//       )
//       // console.log(vscode.window.activeTextEditor.document.getText())
//     } else {
//       const inlineWord = firstResult.word.replace(/\s/g, '')
//       const ranges = relevantResults.map(({ range }) => range)
//       await vscode.window.activeTextEditor.insertSnippet(
//         new vscode.SnippetString(inlineWord),
//         ranges
//       )
//     }
//   } else {
//     await Promise.all(
//       relevantResults.map(result => {
//         const inlineWord = result.word.replace(/\s/g, '')
//         vscode.window.activeTextEditor.insertSnippet(
//           new vscode.SnippetString(inlineWord),
//           result.range,
//           {
//             undoStopBefore: false,
//             undoStopAfter: false,
//           }
//         )
//       })
//     )
//   }
// }

// // const doAutoCompletionElementAutoClose: () => any = () => {}

// export const localPluginAutoCompletionElementAutoClose: LocalPlugin = api => {
//   api.vscodeProxy.workspace.onDidChangeTextDocument(async event => {
//     if (api.utils.isIgnoredDocument(event.document)) {
//       return
//     }
//     if (event.contentChanges.length === 0) {
//       return
//     }
//     const relevantChanges = event.contentChanges.filter(change => {
//       const lastChar = change.text[change.text.length - 1]
//       return (
//         change.rangeLength === 0 &&
//         lastChar === '>' &&
//         !/<\/[a-zA-Z]*>$/.test(change.text)
//       )
//     })
//     if (relevantChanges.length === 0) {
//       return
//     }
//     const positions = relevantChanges.map(
//       change =>
//         new vscode.Position(
//           change.range.start.line,
//           change.range.start.character + change.text.length
//         )
//     )
//     // console.log(JSON.stringify(relevantChanges))
//     const results = await Promise.all(
//       positions.map(position =>
//         askServerForAutoCompletionElementAutoClose(
//           api,
//           event.document,
//           position
//         )
//       )
//     )
//     await applyResults(results)
//   })
// }
