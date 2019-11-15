import * as vscode from 'vscode'
import { constants } from '../../constants'
import { LocalPlugin } from '../localPlugin'

let shownDocumentWarnings: string[] = []

const hasShownWarningMessageForDocument: (
  document: vscode.TextDocument
) => boolean = document =>
  shownDocumentWarnings.some(fsPath => fsPath === document.uri.fsPath)

const showWarningIfDocumentIsTooLarge: () => Promise<void> = async () => {
  if (!vscode.window.activeTextEditor) {
    return
  }
  const document = vscode.window.activeTextEditor.document
  if (!constants.allowedLanguageIds.includes(document.languageId)) {
    return
  }
  if (hasShownWarningMessageForDocument(document)) {
    return
  }
  if (document.getText().length > constants.maxAllowedChars) {
    shownDocumentWarnings.push(document.uri.fsPath)
    if (shownDocumentWarnings.length > 20) {
      shownDocumentWarnings = shownDocumentWarnings.slice(10)
    }
    await vscode.window.showWarningMessage(
      `Html Missing Features is disabled for performance reasons`
    )
  }
}

export const localPluginShowWarningMessageOnLargeFiles: LocalPlugin = async api => {
  showWarningIfDocumentIsTooLarge()
  api.vscodeProxy.window.onDidChangeActiveTextEditor(
    showWarningIfDocumentIsTooLarge
  )
  api.vscodeProxy.workspace.onDidChangeTextDocument(
    showWarningIfDocumentIsTooLarge
  )
}
