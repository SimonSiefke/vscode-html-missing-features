import { constants } from '../../constants'

export interface Utils {
  readonly shouldHaveNewLine: (tagName: string) => boolean
  readonly isSelfClosingTag: (tagName: string) => boolean
  readonly getMatchingTagPairs: (languageId: string) => [string, string][]
}

const tagsThatShouldHaveNewLine: string[] = []
const shouldHaveNewLine: Utils['shouldHaveNewLine'] = tagName =>
  tagsThatShouldHaveNewLine.includes(tagName)

const tagsThatAreSelfClosing: string[] = []
const isSelfClosingTag: Utils['isSelfClosingTag'] = tagName =>
  tagsThatAreSelfClosing.includes(tagName)

const getMatchingTagPairs: Utils['getMatchingTagPairs'] = languageId =>
  constants.matchingTagPairs[languageId] || constants.matchingTagPairs['html']

export const utils: Utils = {
  shouldHaveNewLine,
  isSelfClosingTag,
  getMatchingTagPairs,
}
