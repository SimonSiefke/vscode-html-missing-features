import * as vscode from 'vscode'

export interface Utils {
  readonly isRelevantDocument: (document: vscode.TextDocument) => boolean
}

const allowedLanguageIds: string[] = [
  'erb',
  'html',
  'markdown',
  'javascript',
  'javascriptreact',
  'plaintext',
  'php',
  'razor',
  'svelte',
  'svg',
  'typescript',
  'typescriptreact',
  'xml',
  'vue',
]
const isRelevantDocument: Utils['isRelevantDocument'] = document =>
  !vscode.window.activeTextEditor ||
  vscode.window.activeTextEditor.document !== document ||
  allowedLanguageIds.includes(document.languageId)

export const utils: Utils = {
  isRelevantDocument,
}
