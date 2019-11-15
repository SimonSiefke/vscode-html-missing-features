import * as vscode from 'vscode'
import { LocalPlugin } from '../localPlugin'
import {
  RequestType,
  TextDocumentIdentifier,
  Position,
  CancellationTokenSource,
  CancellationToken,
} from 'vscode-languageclient'
import { LocalPluginApi } from '../../local-plugin-api/localPluginApi'

type Params = {
  readonly textDocument: TextDocumentIdentifier
  readonly positions: Position[]
}
type Result = {
  readonly startOffset: number
  readonly endOffset: number
  readonly word: string
}

const requestType = new RequestType<Params, Result[], any, any>(
  'html-missing-features/auto-completion-element-rename-tag'
)

const askServerForAutoCompletionsElementRenameTag: (
  api: LocalPluginApi,
  document: vscode.TextDocument,
  positions: vscode.Position[],
  cancelToken: CancellationToken
) => Promise<Result[]> = async (api, document, positions, cancelToken) => {
  const params: Params = {
    textDocument: api.languageClientProxy.code2ProtocolConverter.asTextDocumentIdentifier(
      document
    ),
    positions: api.languageClientProxy.code2ProtocolConverter.asPositions(
      positions
    ),
  }
  return api.languageClientProxy.sendRequest(requestType, params, cancelToken)
}

/**
 * Utility variable that stores the last changed version (document.uri.fsPath and document.version)
 * When a change was caused by auto-rename-tag, we can ignore that change, which is a simple performance improvement. One thing to take care of is undo, but that works now (and there are test cases).
 */
let lastChangeByAutoRenameTag: { fsPath: string; version: number } = {
  fsPath: '',
  version: -1,
}

const applyResults: (results: Result[]) => Promise<void> = async results => {
  const relevantResults = results.map(result => {
    const startPosition = activeTextEditor.document.positionAt(
      result.startOffset
    )
    const endPosition = activeTextEditor.document.positionAt(result.endOffset)
    return {
      range: new vscode.Range(startPosition, endPosition),
      word: result.word,
    }
  })
  const prev = activeTextEditor.document.version
  await activeTextEditor.edit(
    editBuilder => {
      for (const result of relevantResults) {
        editBuilder.replace(result.range, result.word)
      }
    },
    {
      undoStopBefore: false,
      undoStopAfter: false,
    }
  )
  const next = activeTextEditor.document.version
  if (prev + 1 !== next) {
    return
  }
  lastChangeByAutoRenameTag = {
    fsPath: activeTextEditor.document.uri.fsPath,
    version: activeTextEditor.document.version,
  }
}

let activeTextEditor: vscode.TextEditor | undefined
let latestCancelTokenSource: CancellationTokenSource | undefined

const doAutoCompletionElementRenameTag: (
  api: LocalPluginApi,
  positions: vscode.Position[]
) => Promise<void> = async (api, positions) => {
  if (latestCancelTokenSource) {
    latestCancelTokenSource.cancel()
  }
  const cancelTokenSource = new CancellationTokenSource()
  latestCancelTokenSource = cancelTokenSource
  if (!activeTextEditor) {
    return
  }
  const beforeVersion = activeTextEditor.document.version
  const results = await askServerForAutoCompletionsElementRenameTag(
    api,
    activeTextEditor.document,
    positions,
    cancelTokenSource.token
  )
  if (latestCancelTokenSource === cancelTokenSource) {
    latestCancelTokenSource = undefined
    cancelTokenSource.dispose()
  }
  if (cancelTokenSource.token.isCancellationRequested) {
    return
  }
  if (results.length === 0) {
    return
  }
  if (!activeTextEditor) {
    return
  }
  const afterVersion = activeTextEditor.document.version
  if (beforeVersion !== afterVersion) {
    return
  }
  await applyResults(results)
}

export const localPluginAutoCompletionElementRenameTag: LocalPlugin = api => {
  activeTextEditor = vscode.window.activeTextEditor
  api.vscodeProxy.window.onDidChangeActiveTextEditor(textEditor => {
    // TODO clean up highlights
    activeTextEditor = textEditor
  })
  api.vscodeProxy.workspace.onDidChangeTextDocument(async event => {
    if (api.utils.isIgnoredDocument(event.document)) {
      return
    }
    if (event.contentChanges.length === 0) {
      return
    }
    const beforeVersion = activeTextEditor.document.version
    // the change event is fired before we can update the version of the last change by auto rename tag, therefore we wait for that
    await new Promise(resolve => setImmediate(resolve))
    if (
      lastChangeByAutoRenameTag.fsPath === event.document.uri.fsPath &&
      lastChangeByAutoRenameTag.version === event.document.version
    ) {
      return
    }
    const afterVersion = activeTextEditor.document.version
    if (beforeVersion !== afterVersion) {
      return
    }
    const positions = event.contentChanges.map(
      ({ range, text }) =>
        new vscode.Position(
          range.start.line,
          range.start.character + text.length
        )
    )
    doAutoCompletionElementRenameTag(api, positions)
  })
}
