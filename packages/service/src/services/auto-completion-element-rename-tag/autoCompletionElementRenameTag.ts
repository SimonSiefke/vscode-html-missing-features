import {
  createScanner,
  ScannerState,
} from '@html-language-features/html-parser'

import { getPreviousOpeningTagName } from '../util/getParentTagName'
import { getNextClosingTagName } from '../util/getNextClosingTagName'

// TODO: bug inside comment
//
//  <h1>
//         hello world

//         <!-- <h1 -->
//       </h1>
export const doAutoCompletionElementRenameTag: (
  text: string,
  offset: number
) =>
  | {
      startOffset: number
      endOffset: number
      word: string
    }
  | undefined = (text, offset) => {
  const scanner = createScanner(text, { initialOffset: offset })
  scanner.stream.goBack(1)
  scanner.stream.goBackToUntilEitherChar('<', '>', '\\', ' ', '\t', '\n')
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
    scanner.stream.goTo(currentPosition)
    scanner.stream.goBackToUntilChar('<')
    const parent = getPreviousOpeningTagName(
      scanner,
      scanner.stream.position - 2
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
    scanner.stream.advanceUntilEitherChar('<', '>')
    const char = scanner.stream.peekRight()
    if (char === '<') {
      return undefined
    }
    scanner.stream.advanceUntilChar('>')
    if (scanner.stream.previousChars(2) === '--') {
      return undefined
    }
    scanner.stream.advance(1)
    const nextClosingTag = getNextClosingTagName(
      scanner,
      scanner.stream.position
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
const text = `<h1>
         hello world
         <!-- <h11 -->
       </h1>`
doAutoCompletionElementRenameTag(text, 43) //?
// doAutoCompletionElementRenameTag('<input></dov>', 10) //?
// createDoAutoRenameTagCompletion('', 5) //?
