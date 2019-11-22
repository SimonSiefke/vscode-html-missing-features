// import * as vscode from 'vscode'
// import { LocalPluginApi } from '../../local-plugin-api/localPluginApi'
// import { LocalPlugin } from '../localPlugin'
// import { RequestType, TextDocumentPositionParams } from 'vscode-languageclient'
// import { constants } from '../../constants'

// // TODO use optional chaining once prettier works with that

// type Result = {
//   completionOffset: number
//   completionString: string
// }

// const requestType = new RequestType<
//   TextDocumentPositionParams,
//   Result,
//   any,
//   any
// >('html-missing-features/auto-completion-insert-quotes-after-equal-sign')

// const askServerForAutoCompletionQuotesAfterEqualSign: (
//   api: LocalPluginApi,
//   document: vscode.TextDocument,
//   position: vscode.Position
// ) => Promise<Result> = async (api, document, position) => {
//   const params = api.languageClientProxy.code2ProtocolConverter.asTextDocumentPositionParams(
//     document,
//     position
//   )
//   const result = await api.languageClientProxy.sendRequest(requestType, params)
//   // TODO duplicate code below
//   if (
//     !vscode.window.activeTextEditor ||
//     vscode.window.activeTextEditor.document.version !== document.version
//   ) {
//     throw new Error('too slow')
//   }
//   return result
// }

// const applyResults: (results: Result[]) => Promise<void> = async results => {
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

//   // TODO different results
//   const ranges = relevantResults.map(({ range }) => range)
//   await vscode.window.activeTextEditor.insertSnippet(
//     new vscode.SnippetString(relevantResults[0].word),
//     ranges
//   )
//   await vscode.commands.executeCommand('editor.action.triggerSuggest')
// }

// export const localPluginAutoCompletionInsertQuotesAfterEqualSign: LocalPlugin = api => {
//   api.vscodeProxy.workspace.onDidChangeTextDocument(async event => {
//     if (api.utils.isIgnoredDocument(event.document)) {
//       return
//     }
//     if (event.contentChanges.length === 0) {
//       return
//     }
//     const relevantChanges = event.contentChanges.filter(change => {
//       const lastChar = change.text[change.text.length - 1]
//       return change.rangeLength === 0 && lastChar === '='
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
//         askServerForAutoCompletionQuotesAfterEqualSign(
//           api,
//           event.document,
//           position
//         )
//       )
//     )
//     await applyResults(results)
//   })
// }
