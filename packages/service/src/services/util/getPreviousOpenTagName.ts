import { createScanner, Scanner, ScannerState, TokenType } from 'html-parser'

export const getPreviousOpeningTagName: (
  scanner: Scanner,
  initialOffset: number,
  matchingTagPairs: [string, string][]
) =>
  | {
      tagName: string
      offset: number
      seenRightAngleBracket: boolean
    }
  | undefined = (scanner, initialOffset, matchingTagPairs) => {
  let offset = initialOffset + 2
  let parentTagName: string | undefined
  let stack: string[] = []
  let seenRightAngleBracket = false
  let selfClosing = false
  let i = 0
  do {
    if (i++ > 1000) {
      throw new Error('probably infinite loop')
    }
    scanner.stream.goTo(offset - 3)
    // scanner.stream.previousChars(20) //?

    const hasFoundChar = scanner.stream.goBackUntilEitherChar(
      ['<', '>'],
      matchingTagPairs
    )
    if (!hasFoundChar) {
      return undefined
    }
    const char = scanner.stream.peekLeft(1) //?
    if (!['<', '>'].includes(char)) {
      return undefined
    }
    if (char === '>') {
      // probably not necessary anymore
      // skip comment
      if (scanner.stream.previousChars(3) === '-->') {
        scanner.stream.goBackToUntilChars('<!--')
        offset = scanner.stream.position - 3
        continue
      } else {
        if (scanner.stream.peekLeft(2) === '/') {
          selfClosing = true
        }
        seenRightAngleBracket = true
        scanner.stream.goBack(1)
        scanner.stream.goBackToUntilChar('<')
        offset = scanner.stream.position
      }
    }
    if (char === '<') {
      seenRightAngleBracket //?
    }
    // don't go outside of comment when inside
    if (scanner.stream.nextChars(3) === '!--') {
      return undefined
    }
    // push closing tags onto the stack
    if (scanner.stream.peekRight() === '/') {
      offset = scanner.stream.position - 1
      scanner.stream.advance(1)
      scanner.state = ScannerState.AfterOpeningEndTag
      scanner.scan()
      const token = scanner.getTokenText()
      if (token === '') {
        offset = scanner.stream.position - 1
        continue
      }
      // console.log('push' + scanner.getTokenText())
      stack.push(scanner.getTokenText())
      continue
    }
    offset = scanner.stream.position
    scanner.state = ScannerState.AfterOpeningStartTag
    // scanner.stream.advance(1)
    const token = scanner.scan()
    // if (!seenRightAngleBracket) {
    //   console.log('no see')
    // }
    if (token !== TokenType.StartTag) {
      return undefined
    }
    const tokenText = scanner.getTokenText()
    // if (isSelfClosingTag(tokenText)) {
    //   continue
    // }
    if (selfClosing) {
      selfClosing = false
      continue
    }
    // pop closing tags from the tags
    if (stack.length) {
      if (stack.pop() !== tokenText) {
        console.error('no')
      }
      continue
    }
    parentTagName = tokenText
    if (parentTagName !== undefined) {
      break
    }
  } while (true)

  return {
    tagName: parentTagName,
    offset,
    seenRightAngleBracket,
  }
}
// const text = `<button> {/* </button> */}</buttonn>`
// getPreviousOpeningTagName(createScanner(text), 25, [['/*', '*/']]) //?

// const text = `<button></buttonn>`
// getPreviousOpeningTagName(createScanner(text), 8, [['/*', '*/']]) //?

// const text = `<button>   </buttonn>`

// getPreviousOpeningTagName(createScanner(text), 10, [['/*', '*/']]) //?

// const text = `<button>{/* <button> */}</buttonn>`
// getPreviousOpeningTagName(createScanner(text), 24, [['/*', '*/']]) //?

// const text = `<div><!-- </div> --> </dddddddd>`
// getPreviousOpeningTagName(createScanner(text), 20, [['<!--', '-->']]) //?

// const text = `<a></b>`
// getPreviousOpeningTagName(createScanner(text), 3, [['<!--', '-->']]) //?
const text = `<div>
  <div></div>
</divv>`
getPreviousOpeningTagName(createScanner(text), 19, [['<!--', '-->']]) //?
