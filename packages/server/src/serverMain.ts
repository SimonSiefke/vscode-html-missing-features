import {
  createConnection,
  IConnection,
  ServerCapabilities,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { createConnectionProxy } from './remote-plugin-api/connectionProxy/connectionProxy'
import { createDocumentsProxy } from './remote-plugin-api/documentsProxy/documentsProxy'
import { RemotePluginApi } from './remote-plugin-api/remotePluginApi'
import { remotePluginAutoCompletionElementAutoClose } from './remote-plugins/remote-plugin-auto-completion-element-auto-close/remotePluginAutoCompletionElementAutoClose'
import { remotePluginAutoCompletionElementSelfClosing } from './remote-plugins/remote-plugin-auto-completion-element-self-closing/remotePluginAutoCompletionElementSelfClosing'
import { remotePluginAutoCompletionInsertQuotesAfterEqualSign } from './remote-plugins/remote-plugin-auto-completion-insert-quotes-after-equal-sign/remotePluginAutoCompletionInsertQuotesAfterEqualSign'
import { remotePluginCommandWrapSelectionWithTag } from './remote-plugins/remote-plugin-command-wrap-selection-with-tag/remotePluginCommandWrapSelectionWithTag'
import { remotePluginAutoCompletionElementRenameTag } from './remote-plugins/remote-plugin-auto-completion-element-rename-tag/remotePluginAutoCompletionElementRenameTag'
import { utils } from './remote-plugin-api/utils/utils'

const connection: IConnection = createConnection()

console.log = connection.console.log.bind(connection.console)
console.error = connection.console.error.bind(connection.console)

process.on('uncaughtException', error => {
  console.error(
    'An uncaught exception occurred. Please open an issue on Github (https://github.com/SimonSiefke/vscode-html-language-features)'
  )
  console.error(error.stack)
})

process.on('unhandledRejection', error => {
  console.error(
    'An unhandled rejection occurred. Please open an issue on Github (https://github.com/SimonSiefke/vscode-html-language-features)'
  )
  console.error((error as Error).stack)
})

const documents = new TextDocuments(TextDocument)

documents.listen(connection)

connection.onInitialize(() => {
  const capabilities: ServerCapabilities = {
    textDocumentSync: TextDocumentSyncKind.Incremental,
  }
  return { capabilities }
})

connection.onInitialized(async () => {
  const api: RemotePluginApi = {
    connectionProxy: createConnectionProxy(connection),
    documentsProxy: createDocumentsProxy(documents),
    utils,
  }
  remotePluginAutoCompletionElementAutoClose(api)
  remotePluginAutoCompletionElementSelfClosing(api)
  remotePluginAutoCompletionInsertQuotesAfterEqualSign(api)
  // remotePluginHighlightElementMatchingTag(api)
  remotePluginCommandWrapSelectionWithTag(api)
  remotePluginAutoCompletionElementRenameTag(api)
})

connection.listen()
