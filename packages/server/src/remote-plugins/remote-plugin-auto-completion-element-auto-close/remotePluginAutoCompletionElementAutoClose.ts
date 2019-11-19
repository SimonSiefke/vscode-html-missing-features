// import { doAutoCompletionElementAutoClose } from 'service'
// import {
//   Position,
//   Range,
//   RequestType,
//   TextDocumentPositionParams,
// } from 'vscode-languageserver'
// import { RemotePlugin } from '../remotePlugin'

// type Result = {
//   completionString: string
//   completionOffset: number
// }

// const requestType = new RequestType<
//   TextDocumentPositionParams,
//   Result | undefined,
//   any,
//   any
// >('html-missing-features/auto-completion-element-auto-close')

// export const remotePluginAutoCompletionElementAutoClose: RemotePlugin = api => {
//   api.connectionProxy.onRequest(
//     requestType,
//     async ({ textDocument, position }) => {
//       const document = api.documentsProxy.get(textDocument.uri)
//       if (!document) {
//         return undefined
//       }
//       const text = document.getText(
//         Range.create(Position.create(0, 0), position)
//       )
//       const offset = document.offsetAt(position)
//       return doAutoCompletionElementAutoClose(text, offset)
//     }
//   )
// }
