import { createScanner, ScannerState, TokenType } from 'html-parser'

import { getPreviousOpeningTagName } from '../util/getPreviousOpenTagName'
import { getNextClosingTagName } from '../util/getNextClosingTagName'
import { getMatchingTagPairs } from '../util/getMatchingTagPairs'

// TODO: bug inside comment
//
//  <h1>
//         hello world

//         <!-- <h1 -->
//       </h1>
export const doAutoCompletionElementRenameTag: (
  text: string,
  offset: number,
  languageId: string
) =>
  | {
      startOffset: number
      endOffset: number
      word: string
    }
  | undefined = (text, offset, languageId) => {
  const matchingTagPairs = getMatchingTagPairs(languageId)
  const scanner = createScanner(text, { initialOffset: offset })
  scanner.stream.goBack(1)
  scanner.stream.goBackWhileRegex(/[^\s<>\\]/)
  const char = scanner.stream.peekLeft(1)
  if (char !== '<') {
    return undefined
  }
  const nextChar = scanner.stream.peekRight(0)
  const atEndTag = nextChar === '/'
  const atStartTag = /[^\s<]/.test(nextChar)
  if (!atEndTag && !atStartTag) {
    return undefined
  }
  if (atEndTag) {
    scanner.stream.advance(1)
    const currentPosition = scanner.stream.position
    scanner.stream.goBackToUntilChar('/')
    scanner.state = ScannerState.AfterOpeningEndTag
    const token = scanner.scan()
    if (token !== TokenType.EndTag) {
      return undefined
    }
    const tagName = scanner.getTokenText()
    scanner.stream.goTo(currentPosition - 2)

    const parent = getPreviousOpeningTagName(
      scanner,
      scanner.stream.position,
      languageId
    )
    if (!parent) {
      return undefined
    }
    if (parent.tagName === tagName) {
      return undefined
    }
    const startOffset = parent.offset
    const endOffset = parent.offset + parent.tagName.length
    const word = tagName
    return {
      startOffset,
      endOffset,
      word,
    }
  } else {
    scanner.stream.goBackToUntilChar('<')
    scanner.state = ScannerState.AfterOpeningStartTag
    scanner.scan()
    const tagName = scanner.getTokenText()
    scanner.stream.advanceUntilEitherChar(['<', '>'], matchingTagPairs)
    const char = scanner.stream.peekRight()
    if (char === '<') {
      return undefined
    }
    scanner.stream.advanceUntilChar('>')
    if (scanner.stream.previousChars(2) === '--') {
      return undefined
    }
    if (scanner.stream.previousChars(1) === '/') {
      return undefined
    }
    scanner.stream.advance(1)
    const nextClosingTag = getNextClosingTagName(
      scanner,
      scanner.stream.position,
      languageId
    )
    if (!nextClosingTag) {
      return undefined
    }
    if (nextClosingTag.tagName === tagName) {
      return undefined
    }
    const startOffset = nextClosingTag.offset
    const endOffset = nextClosingTag.offset + nextClosingTag.tagName.length
    const word = tagName

    return {
      startOffset,
      endOffset,
      word,
    }
  }
}

// TODO add to tests
// const text = `<button>{/* <button> */}</buttonn>`
// doAutoCompletionElementRenameTag(text, 30, [['/*', '*/']]) //?

// const text = `<div><!-- </div> --> </dddddddd>`
// doAutoCompletionElementRenameTag(text, 25, [['<!--', '-->']]) //?

// const text = `<a></b>`
// doAutoCompletionElementRenameTag(text, 6, [['<!--', '-->']]) //?
// const text = `<divvv>
//   <div></div>
// </divv>`
// doAutoCompletionElementRenameTag(text, 25, [['<!--', '-->']]) //?
// const text = `<divv>
//   <div>test</
// </divv>`
// doAutoCompletionElementRenameTag(text, 20, [['<!--', '-->']]) //?
// const text = `<>test</l>`
// doAutoCompletionElementRenameTag(text, 1, [['<!--', '-->']]) //?
// const text = `<svg2 >
// <circle cx="" />
// </svg>`
// doAutoCompletionElementRenameTag(text, 3, [['<!--', '-->']]) //?
// const text = `<aa target="_blank" href="blabla.com">
//     Bla Bla
// </a>`
// doAutoCompletionElementRenameTag(text, 2, 'html') //?

// const text = `<head>
//   <link>
// </headd>`
// doAutoCompletionElementRenameTag(text, 21, 'html') //?
const text = `<head><link></headd>`
doAutoCompletionElementRenameTag(text, 17, 'html') //?
