// /* eslint-disable unicorn/no-for-loop */
// import { TextDocument } from 'vscode-languageserver-types'
// import { doComplete } from './htmlCompletion'

// interface CompletionItem {
//   label: string
//   resultText?: string
// }
// function createTextDocument(text: string): TextDocument {
//   return TextDocument.create('test://test/test.html', 'html', 0, text)
// }

// interface ExpectCompletion {
//   toContain: (
//     expectedCompletions: CompletionItem[]
//   ) => { andToNotContain: (unExpectedCompletions: CompletionItem[]) => void }
//   toNotContain: (unExpectedCompletions: CompletionItem[]) => void
// }

// export function expectCompletionItemsFor(text: string): ExpectCompletion {
//   const offset = text.indexOf('|')
//   const actualText = text.slice(0, offset) + text.slice(offset + 1)
//   const textDocument = createTextDocument(actualText)
//   const rawCompletions = doComplete(textDocument.positionAt(offset)).items
//   const actualCompletions = rawCompletions.map(completion => {
//     const resultText = TextDocument.applyEdits(textDocument, [
//       completion.textEdit,
//     ])
//     return {
//       label: completion.label,
//       resultText,
//     }
//   })

//   const result = {
//     toNotContain(unExpectedCompletions) {
//       for (const unExpectedCompletion of unExpectedCompletions) {
//         expect(actualCompletions).not.toContainEqual(
//           expect.objectContaining(unExpectedCompletion)
//         )
//       }
//     },
//     toContain(expectedCompletions) {
//       for (const expectedCompletion of expectedCompletions) {
//         expect(actualCompletions).toContainEqual(
//           expect.objectContaining(expectedCompletion)
//         )
//       }
//       return {
//         andToNotContain: result.toNotContain,
//       }
//     },
//   }
//   return result
// }

// test('html completion #1', () => {
//   expectCompletionItemsFor('<|').toContain([
//     {
//       label: 'div',
//       resultText: '<div',
//     },
//     {
//       label: 'h1',
//       resultText: '<h1',
//     },
//     {
//       label: 'iframe',
//       resultText: '<iframe',
//     },
//   ])
// })

// test('html completion #2', () => {
//   expectCompletionItemsFor('<|').toContain([
//     { label: '!DOCTYPE' },
//     { label: 'iframe' },
//     { label: 'h1' },
//     { label: 'div' },
//   ])
// })

// // test('html completion #3', () => {
// //   expectCompletion('\n<|')
// //     .toContain([{ label: 'iframe' }, { label: 'h1' }, { label: 'div' }])
// //     .andToNotContain([{ label: '!DOCTYPE' }])
// // })

// test('html completion #4', () => {
//   expectCompletionItemsFor('< |').toNotContain([
//     { label: 'iframe', resultText: '<iframe' },
//     { label: 'h1', resultText: '<h1' },
//     { label: 'div', resultText: '<div' },
//   ])
// })

// test('html completion #5', () => {
//   expectCompletionItemsFor('<h|').toContain([
//     { label: 'html', resultText: '<html' },
//     { label: 'h1', resultText: '<h1' },
//     { label: 'header', resultText: '<header' },
//   ])
// })
