export interface Constants {
  /**
   * Array of ids where this extension is enabled
   */
  readonly allowedLanguageIds: string[]

  /**
   * Maximum numbers of characters in a document, for which this extension is enabled.
   * For larger files it would cause high cpu load.
   */
  readonly maxAllowedChars: number
}

export const constants = {
  allowedLanguageIds: [
    'html',
    'javascript',
    'javascriptreact',
    'php',
    'razor',
    'svelte',
    'typescript',
    'typescriptreact',
    'xml',
    'vue',
  ],
  maxAllowedChars: 80000,
}
