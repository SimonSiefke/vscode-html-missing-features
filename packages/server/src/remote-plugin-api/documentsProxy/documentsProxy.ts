import { TextDocuments } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'

/**
 * Wrapper around `documents`
 */
export interface DocumentsProxy {
  readonly get: TextDocuments<TextDocument>['get']
}

export const createDocumentsProxy: (
  documents: TextDocuments<TextDocument>
) => DocumentsProxy = documents => documents
