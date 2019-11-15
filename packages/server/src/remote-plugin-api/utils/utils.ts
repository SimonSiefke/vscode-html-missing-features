export interface Utils {
  readonly shouldHaveNewLine: (tagName: string) => boolean
  readonly isSelfClosingTag: (tagName: string) => boolean
}

const tagsThatShouldHaveNewLine: string[] = []
const shouldHaveNewLine: Utils['shouldHaveNewLine'] = tagName =>
  tagsThatShouldHaveNewLine.includes(tagName)

const tagsThatAreSelfClosing: string[] = []
const isSelfClosingTag: Utils['isSelfClosingTag'] = tagName =>
  tagsThatAreSelfClosing.includes(tagName)

export const utils: Utils = {
  shouldHaveNewLine,
  isSelfClosingTag,
}
