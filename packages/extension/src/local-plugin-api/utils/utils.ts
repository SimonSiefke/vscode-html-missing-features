import { TextDocument } from 'vscode'
import * as vscode from 'vscode'
import { constants } from '../../constants'

export interface Utils {
  readonly isIgnoredDocument: (document: TextDocument) => boolean
}

export const utils: Utils = {
  isIgnoredDocument: document => {
    if (
      !vscode.window.activeTextEditor ||
      vscode.window.activeTextEditor.document !== document
    ) {
      return true
    }
    // if (!constants.allowedLanguageIds.includes(document.languageId)) {
    //   return true
    // }
    if (document.getText().length > constants.maxAllowedChars) {
      return true
    }
    return false
  },
}
