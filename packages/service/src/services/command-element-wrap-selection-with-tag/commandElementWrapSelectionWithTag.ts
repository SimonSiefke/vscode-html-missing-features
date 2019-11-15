export const doCompletionElementWrapSelectionWithTag: (
  text: string,
  startOffset: number,
  endOffset: number
) =>
  | { completionString: string; completionStart: number; completionEnd: number }
  | undefined = (text, startOffset, endOffset) => {
  const selectedText = text.slice(startOffset, endOffset)
  return {
    completionString: `<\${0:div}>\n\t${selectedText}\n</div>`,
    completionStart: startOffset,
    completionEnd: endOffset,
  }
}
