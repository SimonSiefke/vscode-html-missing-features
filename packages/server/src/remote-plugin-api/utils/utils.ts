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

const matchingTagPairs: { [languageId: string]: [string, string][] } = {
  css: [['/*', '*/']],
  ruby: [['<%=', '%>']],
  html: [
    ['<!--', '-->'],
    ['"', '"'],
    ["'", "'"],
    ['<%=', '%>'], // support for html-webpack-plugin
  ],
  markdown: [
    ['<!--', '-->'],
    ['```', '```'],
    ['<?', '?>'],
  ],
  plaintext: [['<!--', '-->']],
  php: [
    ['<!--', '-->'],
    ['<?', '?>'],
  ],
  javascript: [
    ['<!--', '-->'],
    ["'", "'"],
    ['"', '"'],
    ['`', '`'],
  ],
  javascriptreact: [['{', '}']],
  razor: [
    ['<!--', '-->'],
    ['@{', '}'],
  ],
  svelte: [['<!--', '-->']],
  typescript: [
    ['<!--', '-->'],
    ["'", "'"],
    ['"', '"'],
    ['`', '`'],
  ],
  typescriptreact: [['{', '}']],
  twig: [
    ['<!--', '-->'],
    ['{{', '}}'],
    ['{%', '%}'],
  ],
  xml: [
    ['<!--', '-->'],
    ['<?', '?>'],
  ],
  vue: [['<!--', '-->']],
}
const getMatchingTagPairs: Utils['getMatchingTagPairs'] = languageId =>
  matchingTagPairs[languageId] || matchingTagPairs['html']

export const utils: Utils = {
  shouldHaveNewLine,
  isSelfClosingTag,
  getMatchingTagPairs,
}
