// import { RemotePlugin } from '../remotePlugin'
// import {
//   Range,
//   TextDocumentIdentifier,
//   RequestType,
// } from 'vscode-languageserver'
// import { doCompletionElementWrapSelectionWithTag } from 'service'

// type Result = {
//   completionString: string
//   completionRange: Range
// }

// type Params = {
//   textDocument: TextDocumentIdentifier
//   selection: Range
// }

// const requestType = new RequestType<Params, Result, any, any>(
//   'html-missing-features/wrap-selection-with-tag'
// )

// export const remotePluginCommandWrapSelectionWithTag: RemotePlugin = api => {
//   api.connectionProxy.onRequest(requestType, ({ textDocument, selection }) => {
//     const document = api.documentsProxy.get(textDocument.uri)
//     if (!document) {
//       return undefined
//     }
//     const startOffset = document.offsetAt(selection.start)
//     const endOffset = document.offsetAt(selection.end)
//     const text = document.getText()
//     const result = doCompletionElementWrapSelectionWithTag(
//       text,
//       startOffset,
//       endOffset
//     )
//     if (!result) {
//       return undefined
//     }
//     return {
//       completionString: result.completionString,
//       completionRange: Range.create(
//         document.positionAt(result.completionStart),
//         document.positionAt(result.completionEnd)
//       ),
//     }
//   })
// }
