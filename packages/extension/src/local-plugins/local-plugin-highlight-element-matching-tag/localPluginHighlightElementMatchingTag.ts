// import * as vscode from 'vscode'
// import { LocalPluginApi } from '../../local-plugin-api/localPluginApi'
// import { LocalPlugin } from '../localPlugin'
// import { TextDocumentPositionParams, RequestType } from 'vscode-languageclient'
// import { constants } from '../../constants'

// type Result =
//   | {
//       type: 'startAndEndTag'
//       tagName: string
//       startTagOffset: number
//       endTagOffset: number
//     }
//   | {
//       type: 'onlyStartTag'
//       tagName: string
//       startTagOffset: number
//     }
//   | {
//       type: 'onlyEndTag'
//       tagname: string
//       endTagOffset: number
//     }

// const requestType = new RequestType<
//   TextDocumentPositionParams,
//   Result,
//   any,
//   any
// >('html-missing-features/highlight-element-matching-tag')

// const highlightElementMatchingTagDecorationType = vscode.window.createTextEditorDecorationType(
//   {
//     borderWidth: '0 0 1px 0',
//     borderStyle: 'solid',
//     borderColor: 'yellow',
//   }
// )

// // const askServiceForHighlightElementMatchingTag: (
// //   api: LocalPluginApi,
// //   document: vscode.TextDocument,
// //   position: vscode.Position
// // ) => Result | undefined = (api, document, position) => {
// //   const text = document.getText()
// //   const offset = document.offsetAt(position)
// //   return findMatchingTags(text, offset)
// // }

// const askServerForHighlightElementMatchingTag: (
//   api: LocalPluginApi,
//   document: vscode.TextDocument,
//   position: vscode.Position
// ) => Promise<Result | undefined> = async (api, document, position) => {
//   const params = api.languageClientProxy.code2ProtocolConverter.asTextDocumentPositionParams(
//     document,
//     position
//   )
//   const result = await api.languageClientProxy.sendRequest(requestType, params)
//   if (
//     !vscode.window.activeTextEditor ||
//     vscode.window.activeTextEditor.document.version !== document.version
//   ) {
//     return undefined
//     // throw new Error('too slow')
//   }
//   return result
// }

// const setDecorations: (
//   decorationOffsets: [number, number][]
// ) => void = decorationOffsets => {
//   const document = vscode.window.activeTextEditor.document
//   const decorations: vscode.Range[] = decorationOffsets.map(
//     ([startOffset, endOffset]) =>
//       new vscode.Range(
//         document.positionAt(startOffset),
//         document.positionAt(endOffset)
//       )
//   )
//   vscode.window.activeTextEditor.setDecorations(
//     highlightElementMatchingTagDecorationType,
//     decorations
//   )
// }

// const applyResults = (results: (Result | undefined)[]) => {
//   const decorations = results.filter(Boolean).flatMap(result => {
//     if (result.type === 'startAndEndTag') {
//       const { startTagOffset, endTagOffset, tagName } = result
//       return [
//         [startTagOffset + 1, startTagOffset + tagName.length + 1],
//         [endTagOffset + 2, endTagOffset + tagName.length + 2],
//       ] as [number, number][]
//     } else if (result.type === 'onlyStartTag') {
//       const { startTagOffset, tagName } = result
//       return [[startTagOffset + 1, startTagOffset + tagName.length + 1]] as [
//         number,
//         number
//       ][]
//     } else if (result.type === 'onlyEndTag') {
//       // TODO
//       return [] as [number, number][]
//     }
//   })
//   setDecorations(decorations)
// }

// // TODO very slight delay when renaming tag (because of duplicate requests?)

// let requestBuffer: (() => Promise<Result[]>)[] = []

// // TODO different highlight color for different users

// /**
//  * Asks the server for matching tags and highlights them.
//  * For performance reasons there is a request buffer. When a
//  * file is changed, the auto-rename-tag plugin might cause
//  * another change. For the first change the server returns no
//  * matching tags so that the highlight will disappear. For the
//  * second change the server returns the matching tags. This causes
//  * flickering, which is bad. In current implementation, only for
//  * the second change a request will be sent to the server, which
//  * should prevent flickering since the second change is caused by
//  * auto-rename tag and the tags are still matching.
//  */
// const doHighlightElementMatchingTag: (
//   api: LocalPluginApi
// ) => Promise<void> = async api => {
//   if (!vscode.window.activeTextEditor) {
//     return
//   }
//   const requestFunction = () =>
//     Promise.all(
//       vscode.window.activeTextEditor.selections.map(selection =>
//         askServerForHighlightElementMatchingTag(
//           api,
//           vscode.window.activeTextEditor.document,
//           selection.active
//         )
//       )
//     )
//   requestBuffer.push(requestFunction)
//   if (api.autoRenameTagPromise) {
//     await api.autoRenameTagPromise
//   }
//   if (requestBuffer[requestBuffer.length - 1] === requestFunction) {
//     requestBuffer = []
//     const results = await requestFunction()
//     applyResults(results)
//   }
// }

// export const localPluginHighlightElementMatchingTag: LocalPlugin = async api => {
//   api.vscodeProxy.workspace.onDidChangeTextDocument(async event => {
//     if (api.utils.isIgnoredDocument(event.document)) {
//       return
//     }
//     if (event.contentChanges.length === 0) {
//       return
//     }
//     doHighlightElementMatchingTag(api)
//   })
//   api.vscodeProxy.window.onDidChangeTextEditorSelection(async event => {
//     if (api.utils.isIgnoredDocument(event.textEditor.document)) {
//       return
//     }
//     doHighlightElementMatchingTag(api)
//   })
//   if (
//     vscode.window.activeTextEditor &&
//     !api.utils.isIgnoredDocument(vscode.window.activeTextEditor.document)
//   ) {
//     doHighlightElementMatchingTag(api)
//   }
// }
