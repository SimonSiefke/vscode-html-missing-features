import { ScannerState, TokenType, createScanner } from 'html-parser'

/**
 * Completion for self-closing elements
 *
 * `<input/` -> `<input/>`
 */
export const doAutoCompletionElementSelfClosing: (
  text: string,
  offset: number
) =>
  | {
      completionString: string
      completionOffset: number
    }
  | undefined = (text, offset) => {
  const scanner = createScanner(text)
  scanner.stream.goTo(offset)

  if (!scanner.stream.currentlyEndsWith('/')) {
    return undefined
  }
  scanner.stream.goBackToUntilChar('<')
  scanner.state = ScannerState.AfterOpeningStartTag
  const token = scanner.scan()
  if (token !== TokenType.StartTag) {
    return undefined
  }
  return {
    completionString: '>',
    completionOffset: offset,
  }
}

// doCompletionElementSelfClosing('<input /', 8)//?
