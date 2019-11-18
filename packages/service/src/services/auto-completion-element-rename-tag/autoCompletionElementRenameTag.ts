import { createScanner, ScannerState } from 'html-parser'

import { getPreviousOpeningTagName } from '../util/getPreviousOpenTagName'
import { getNextClosingTagName } from '../util/getNextClosingTagName'

// TODO: bug inside comment
//
//  <h1>
//         hello world

//         <!-- <h1 -->
//       </h1>
export const doAutoCompletionElementRenameTag: (
  text: string,
  offset: number,
  matchingTagPairs: [string, string][]
) =>
  | {
      startOffset: number
      endOffset: number
      word: string
    }
  | undefined = (text, offset, matchingTagPairs) => {
  const scanner = createScanner(text, { initialOffset: offset })
  scanner.stream.goBack(1)
  scanner.stream.goBackWhileRegex(/[^\s<>\\]/)
  const char = scanner.stream.peekLeft(1)
  if (char !== '<') {
    return undefined
  }
  const nextChar = scanner.stream.peekRight(0)
  const atEndTag = nextChar === '/'
  const atStartTag = /[^\s<>]/.test(nextChar)
  if (!atEndTag && !atStartTag) {
    return undefined
  }
  if (atEndTag) {
    scanner.stream.advance(1)
    const currentPosition = scanner.stream.position
    scanner.stream.goBackToUntilChar('/')
    scanner.state = ScannerState.AfterOpeningEndTag
    scanner.scan()
    const tagName = scanner.getTokenText()
    scanner.stream.goTo(currentPosition - 2)

    const parent = getPreviousOpeningTagName(
      scanner,
      scanner.stream.position,
      matchingTagPairs
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
      matchingTagPairs
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

const text = `<a></b>`
doAutoCompletionElementRenameTag(text, 6, [['<!--', '-->']]) //?
