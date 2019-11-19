// import {
//   getPreviousOpeningTagName,
//   // getNextClosingTag,
// } from '../util/getPreviousOpenTagName'
// import { createScanner } from 'html-parser'
// import { getNextClosingTagName } from '../util/getNextClosingTagName'

// /**
//  * Completion for closing end-tag
//  *
//  *`<p>this is text</` -> `<p>this is text</p>`.
//  */
// export const doAutoCompletionElementClose: (
//   text: string,
//   offset: number
// ) =>
//   | {
//       completionString: string
//       completionOffset: number
//     }
//   | undefined = (text, offset) => {
//   // TODO partial get text
//   const scanner = createScanner(text)
//   scanner.stream.goTo(offset)
//   // console.log('inside')
//   if (!scanner.stream.currentlyEndsWith('</')) {
//     console.log('no end')
//     return undefined
//   }
//   let before = scanner.stream.position - 3
//   let after = scanner.stream.position
//   // scanner.stream.goBack(3)
//   let tagName: string
//   let stack = []
//   let i = 0
//   while (before > 0) {
//     if (i++ > 1) {
//       return undefined
//     }
//     const previousOpeningTagName = getPreviousOpeningTagName(
//       scanner,
//       before,
//       []
//     )
//     const nextClosingTagName = getNextClosingTagName(scanner, after, [
//       ['<!--', '-->'],
//     ])
//     if (!previousOpeningTagName) {
//       return undefined
//     }
//     if (
//       !nextClosingTagName ||
//       previousOpeningTagName.tagName !== nextClosingTagName.tagName
//     ) {
//       return {
//         completionString: `${previousOpeningTagName.tagName}>`,
//         completionOffset: offset,
//       }
//     }
//     before = previousOpeningTagName.offset - 1
//     after = nextClosingTagName.offset
//   }

//   // console.log('prev' + previousOpeningTagName!.tagName)
//   // console.log(scanner.stream.getSource())
//   // console.log('next' + JSON.stringify(nextClosingTagName))
//   return undefined
//   // do {
//   //   scanner.stream.goBackToUntilChar('<')
//   //   if (scanner.stream.position === 0) {
//   //     return false
//   //   }
//   //   const { position } = scanner.stream
//   //   scanner.state = ScannerState.AfterOpeningStartTag
//   //   const token = scanner.scan()
//   //   if (token !== TokenType.StartTag) {
//   //     scanner.stream.goTo(position - 2)
//   //     continue
//   //   }
//   //   tagName = scanner.getTokenText()
//   //   if (isSelfClosingTag(tagName)) {
//   //     scanner.stream.goTo(position - 2)
//   //     continue
//   //   }
//   // } while (i++ < 8)

//   // // @ts-ignore
//   // return { tagName }
// }

// const text = `<h1><!-- <h2> --></`
// doAutoCompletionElementClose(text, text.length) //?
