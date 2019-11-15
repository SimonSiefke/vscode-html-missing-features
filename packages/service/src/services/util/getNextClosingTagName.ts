import {
  Scanner,
  ScannerState,
  TokenType,
  createScanner,
} from '@html-language-features/html-parser'

import { isSelfClosingTag } from '../../Data/Data'

export const getNextClosingTagName: (
  scanner: Scanner,
  initialOffset: number
) =>
  | {
      tagName: string
      offset: number
      seenRightAngleBracket: boolean
    }
  | undefined = (scanner, initialOffset) => {
  let offset = initialOffset
  let nextClosingTagName: string | undefined
  let stack: string[] = []
  let seenRightAngleBracket = false
  let i = 0
  scanner.stream.goTo(offset)
  do {
    if (i++ > 1000) {
      // TODO show ui error (Auto Rename Tag does not work for this tag because the matching tag is too far away.)
      throw new Error('probably infinite loop')
    }
    scanner.stream.advanceUntilEitherChar('<', '>')
    const char = scanner.stream.peekRight() //?
    if (!['<', '>'].includes(char)) {
      return undefined
    }
    if (char === '<') {
      // skip comment
      // scanner.stream.nextChars(4); //?
      if (scanner.stream.peekRight(1) === '/') {
        scanner.stream.advance(2)
        offset = scanner.stream.position
        scanner.state = ScannerState.AfterOpeningEndTag
        const token = scanner.scan()
        if (token !== TokenType.EndTag) {
          return undefined
        }
        const tokenText = scanner.getTokenText()
        if (stack.length) {
          if (stack.pop() !== tokenText) {
            console.error('no')
          }
          continue
        }
        nextClosingTagName = tokenText
        if (nextClosingTagName !== undefined) {
          break
        }
      }

      if (scanner.stream.nextChars(4) === '<!--') {
        scanner.stream.advanceUntilChars('-->')
        scanner.stream.advance(3)
        continue
      } else {
        scanner.stream.advance(1)
        scanner.state = ScannerState.AfterOpeningStartTag
        const token = scanner.scan()
        if (token !== TokenType.StartTag) {
          // console.log(scanner.getTokenText());
          // console.log("no start tag");
          return undefined
        }
        const tokenText = scanner.getTokenText()
        if (isSelfClosingTag(tokenText)) {
          continue
        }
        // push opening tag onto the stack
        stack.push(tokenText)
        continue
      }
    } else {
      if (scanner.stream.peekRight(1) === '') {
        // console.log("end");
        return undefined
      }
      // don't go outside of comment when inside
      if (scanner.stream.previousChars(2) === '--') {
        // console.log("return undefined");
        return undefined
      }
      if (scanner.stream.peekLeft(1) === '/') {
        if (scanner.stream.peekLeft(1) === '/') {
          if (stack.length === 0) {
            // console.log("return undefined 2");
            return undefined
          }
          stack.pop()
          // console.log("pop");
          scanner.stream.advance(1)
          continue
        }
      }
      // console.log("advance 1");
      scanner.stream.advance(1)
    }
  } while (true)

  return {
    tagName: nextClosingTagName,
    offset,
    seenRightAngleBracket,
  }
}

const text = `<a><img /></a>`

getNextClosingTagName(createScanner(text), 0) //?
