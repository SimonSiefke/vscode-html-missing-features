export interface Constants {
  /**
   * The quote char used for attribute completions
   */
  quote: '"' | "'"
  matchingTagPairs: { [languageId: string]: [string, string][] }
}

export const constants: Constants = {
  quote: '"',
  matchingTagPairs: {
    css: [['/*', '*/']],
    ruby: [['<%=', '%>']],
    html: [['<!--', '-->']],
    markdown: [
      ['<!--', '-->'],
      ['```', '```'],
      ['<?php', '?>'],
    ],
    plaintext: [['<!--', '-->']],
    php: [
      ['<!--', '-->'],
      ['<?php', '?>'],
    ],
    javascriptreact: [['/*', '*/']],
    razor: [
      ['<!--', '-->'],
      ['@{', '}'],
    ],
    svelte: [['<!--', '-->']],
    typescriptreact: [['/*', '*/']],
    xml: [['<!--', '-->']],
    vue: [['<!--', '-->']],
  },
}

//  'onLanguage:javascript',
//  'onLanguage:typescript',
