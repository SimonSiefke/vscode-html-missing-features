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
// >('html-missing-features/auto-completion-element-self-closing')

// const askServerForAutoCompletionElementSelfClosing: (
//   api: LocalPluginApi,
//   document: vscode.TextDocument,
//   position: vscode.Position
// ) => Promise<Result> = async (api, document, position) => {
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
//   return result
// }

// const applyResult: (result: Result) => Promise<void> = async result => {
//   if (!result) {
//     return
//   }
//   await vscode.window.activeTextEditor.insertSnippet(
//     new vscode.SnippetString(result.completionString)
//   )
// }

// export const localPluginAutoCompletionElementSelfClosing: LocalPlugin = api => {
//   api.vscodeProxy.workspace.onDidChangeTextDocument(async event => {
//     if (api.utils.isIgnoredDocument(event.document)) {
//       return
//     }
//     if (event.contentChanges.length === 0) {
//       return
//     }
//     const lastChange = event.contentChanges[event.contentChanges.length - 1]
//     const lastCharacter = lastChange.text[lastChange.text.length - 1]
//     if (lastChange.rangeLength > 0 || lastCharacter !== '/') {
//       return
//     }
//     const rangeStart = lastChange.range.start
//     const position = new vscode.Position(
//       rangeStart.line,
//       rangeStart.character + lastChange.text.length
//     )
//     const result = await askServerForAutoCompletionElementSelfClosing(
//       api,
//       event.document,
//       position
//     )
//     applyResult(result)
//   })
// }
