// import {
//   Position,
//   CompletionList,
//   CompletionItemKind,
//   TextEdit,
//   CompletionItem,
//   TextDocument,
// } from 'vscode-languageserver-types'
// import {
//   Scanner,
//   ScannerState,
//   createScanner,
//   TokenType,
// } from '@html-language-features/html-parser'
// import { statisticsForTags } from '@html-language-features/html-intellicode'
// import { isSelfClosingTag } from '../../data/Facts'

// export const enum CompletionItemType {
//   tagName,
//   attributeName,
//   attributeValue,
// }

// type Completion = (
//   scanner: Scanner,
//   offset: number
// ) =>
//   | {
//       completions: { tagName: string; probability: number }[]
//       completionOffset: number
//     }
//   | undefined

// /**
//  * Start tag completion
//  * `<` -> `<h1`
//  * `<` -> `<div`.
//  */
// const startTagCompletion: Completion = scanner => {
//   // const suggestedTags = statistics.body
//   if (!scanner.stream.currentlyEndsWithRegex(/<[!a-zA-Z\d-]*$/)) {
//     return undefined
//   }
//   scanner.stream.goBackToUntilChar('<')
//   const completionOffset = scanner.stream.position
//   scanner.state = ScannerState.AfterOpeningStartTag
//   // scanner.scan()
//   // const incompleteTagName = scanner.getTokenText()
//   // const allTags = getHTMLTagNames()
//   let offset = completionOffset
//   let parentTagName: string
//   do {
//     scanner.stream.goTo(offset - 2)
//     scanner.stream.goBackToUntilChar('<')
//     offset = scanner.stream.position
//     scanner.state = ScannerState.AfterOpeningStartTag
//     const token = scanner.scan()
//     if (token !== TokenType.StartTag) {
//       return undefined
//     }
//     parentTagName = scanner.getTokenText()
//   } while (isSelfClosingTag(parentTagName))
//   const suggestedTags = statisticsForTags[parentTagName]
//   if (!suggestedTags) {
//     return undefined
//   }

//   // const suggestedTags = allTags.filter(
//   //   tag => !incompleteTagName || tag.startsWith(incompleteTagName)
//   // )
//   return {
//     completions: suggestedTags.map(tag => ({
//       tagName: tag.name,
//       probability: tag.probability,
//     })),
//     completionOffset,
//   }
// }

// // @ts-ignore
// // function startTagCompletion(position: Position): CompletionList {
// //   const html5TagNames = Object.keys(html5Tags)
// //   const items: CompletionItem[] = html5TagNames.map(
// //     (tagName): CompletionItem => ({
// //       label: tagName,
// //       kind: CompletionItemKind.Property,
// //       textEdit: TextEdit.replace(
// //         {
// //           start: position,
// //           end: position,
// //         },
// //         tagName
// //       ),
// //       insertTextFormat: InsertTextFormat.PlainText,
// //       data: {
// //         type: CompletionItemType.tagName,
// //       },
// //     })
// //   )
// //   return {
// //     isIncomplete: false,
// //     items,
// //   }
// // }

// // const completions = [startTagCompletion]

// const createCompletionItem: ({
//   preselected,
//   label,
//   position,
//   // documentation,
//   detail,
//   index,
// }: {
//   preselected: boolean
//   label: string
//   // documentation?: string | undefined
//   detail?: string | undefined
//   index?: number

//   position: Position
// }) => CompletionItem = ({ preselected, label, position, detail, index }) => ({
//   label: preselected ? `★ ${label}` : label,
//   detail,
//   kind: CompletionItemKind.Struct,
//   filterText: preselected ? label : `\uE83A ${label}`, // prepend weird char to make it appear below the preselected items
//   sortText: preselected ? `${index} ${label}` : `\uE83A ${label}`, // prepend weird char to make it appear below the preselected items
//   textEdit: TextEdit.replace(
//     {
//       start: position,
//       end: position,
//     },
//     label
//   ),
// })

// export const doComplete: (
//   textDocument: TextDocument,
//   position: Position
// ) => CompletionList | undefined = (textDocument, position) => {
//   const text = textDocument.getText({
//     start: {
//       character: 0,
//       line: 0,
//     },
//     end: position,
//   })
//   const offset = textDocument.offsetAt(position)
//   const scanner = createScanner(text)
//   scanner.stream.goTo(offset)
//   const result = startTagCompletion(scanner, offset)
//   if (!result) {
//     return undefined
//   }
//   const { completions, completionOffset } = result
//   const recommendedCompletions = completions.slice(0, 2)
//   const nonRecommendedCompletions = completions.slice(2)
//   const completionPosition = textDocument.positionAt(completionOffset)
//   const recommendedItems = recommendedCompletions.map((completion, index) =>
//     createCompletionItem({
//       index,
//       preselected: true,
//       label: completion.tagName,
//       position: completionPosition,
//       detail: `${(completion.probability * 100).toFixed(2)}% Match`,
//       // documentation: getHTMLTags()[completionString].description,
//     })
//   )
//   const nonRecommendedItems = nonRecommendedCompletions.map(completion =>
//     createCompletionItem({
//       preselected: false,
//       label: completion.tagName,
//       position: completionPosition,
//       // documentation: getHTMLTags()[completionString].description,
//     })
//   )
//   const items = [
//     ...recommendedItems,
//     ...nonRecommendedItems,
//     // ...htmlEmmetTagCompletion(position).items,
//   ]
//   return {
//     isIncomplete: true,
//     items,
//   }
// }

// // function createTextDocument(text: string): TextDocument {
// //   return TextDocument.create('test://test/test.html', 'html', 0, text)
// // }
// // const text = '<|'

// // const offset = text.indexOf('|')
// // const actualText = text.slice(0, offset) + text.slice(offset + 1)
// // const textDocument = createTextDocument(actualText)
// // const completions = startTagCompletion(textDocument.positionAt(offset)).items // ?
// // // for

// // const normalizedCompletions = completions.map(completion => {
// //   const resultText = TextDocument.applyEdits(textDocument, [
// //     completion.textEdit,
// //   ])
// //   return {
// //     label: completion.label,
// //     resultText,
// //   }
// // })
// // normalizedCompletions
