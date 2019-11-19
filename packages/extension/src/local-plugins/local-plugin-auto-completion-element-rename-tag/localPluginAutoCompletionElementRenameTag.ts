import * as vscode from 'vscode'
import { LocalPlugin } from '../localPlugin'
import {
  RequestType,
  TextDocumentIdentifier,
  CancellationTokenSource,
} from 'vscode-languageclient'
import { LocalPluginApi } from '../../local-plugin-api/localPluginApi'

interface Tag {
  word: string
  offset: number
  oldWord: string
}

interface Params {
  readonly textDocument: TextDocumentIdentifier
  readonly tags: Tag[]
}

interface Result {
  readonly originalOffset: number
  readonly originalWord: string
  readonly startOffset: number
  readonly endOffset: number
  readonly tagName: string
}

const requestType = new RequestType<Params, Result[], any, any>(
  'html-missing-features/auto-completion-element-rename-tag'
)

// TODO implement max concurrent requests

const askServerForAutoCompletionsElementRenameTag: (
  api: LocalPluginApi,
  document: vscode.TextDocument,
  tags: Tag[]
) => Promise<Result[]> = async (api, document, tags) => {
  const params: Params = {
    textDocument: api.languageClientProxy.code2ProtocolConverter.asTextDocumentIdentifier(
      document
    ),
    tags,
  }
  return api.languageClientProxy.sendRequest(requestType, params)
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
  const prev = activeTextEditor.document.version
  const applied = await activeTextEditor.edit(
    editBuilder => {
      for (const result of results) {
        const startPosition = activeTextEditor.document.positionAt(
          result.startOffset
        )
        const endPosition = activeTextEditor.document.positionAt(
          result.endOffset
        )
        const range = new vscode.Range(startPosition, endPosition)
        editBuilder.replace(range, result.tagName)
      }
    },
    {
      undoStopBefore: false,
      undoStopAfter: false,
    }
  )
  const next = activeTextEditor.document.version
  if (!applied) {
    // console.log(prev, next)
    // console.log(JSON.stringify(results))
    return
    // throw new Error('not applied')
  }
  if (prev + 1 !== next) {
    // console.log(prev, next)
    // console.log(JSON.stringify(results))
    // console.log('return 3')
    // console.log('applied' + applied)
    // throw new Error()
    return
  }

  for (const result of results) {
    // console.log('(1) set old word to ' + result.originalWord)
    wordsAtOffsets[result.originalOffset].oldWord = result.originalWord
  }
  lastChangeByAutoRenameTag = {
    fsPath: activeTextEditor.document.uri.fsPath,
    version: activeTextEditor.document.version,
  }
}

let tags: Tag[]
let activeTextEditor: vscode.TextEditor | undefined
let latestCancelTokenSource: CancellationTokenSource | undefined
let previousText: string

const wordsAtOffsets: {
  [offset: number]: {
    oldWord: string
    newWord: string
  }
} = {}

const doAutoCompletionElementRenameTag: (
  api: LocalPluginApi,
  tags: Tag[]
) => Promise<void> = async (api, tags) => {
  for (const tag of tags) {
    // console.log('(2) set old word to ' + tag.oldWord)
    wordsAtOffsets[tag.offset] = {
      oldWord:
        (wordsAtOffsets[tag.offset] && wordsAtOffsets[tag.offset].oldWord) ||
        tag.oldWord,
      newWord: tag.word,
    }
    tag.oldWord = wordsAtOffsets[tag.offset].oldWord
    // console.log('(2) get old word ' + tag.oldWord)
  }
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
    tags
  )
  if (cancelTokenSource.token.isCancellationRequested) {
    console.log('cancel requested')
    return
  }
  if (latestCancelTokenSource === cancelTokenSource) {
    latestCancelTokenSource = undefined
    cancelTokenSource.dispose()
  }
  if (results.length === 0) {
    // console.log(wordsAtOffsets)
    // console.log('no results')
    // process.exit(1)
    return
  }
  if (!activeTextEditor) {
    return
  }
  const afterVersion = activeTextEditor.document.version
  if (beforeVersion !== afterVersion) {
    console.log('return 2')
    return
  }
  await applyResults(results)
}

export const localPluginAutoCompletionElementRenameTag: LocalPlugin = api => {
  activeTextEditor = vscode.window.activeTextEditor
  previousText =
    activeTextEditor.document && activeTextEditor.document.getText()
  api.vscodeProxy.window.onDidChangeActiveTextEditor(textEditor => {
    // TODO clean up highlights
    activeTextEditor = textEditor
    previousText =
      activeTextEditor.document && activeTextEditor.document.getText()
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
      // console.log('return 3')
      return
    }
    const afterVersion = activeTextEditor.document.version
    if (beforeVersion !== afterVersion) {
      // console.log('return 1')
      // console.log(event.contentChanges)
      return
    }
    tags = event.contentChanges.reduce((total, change) => {
      const startPosition = event.document.positionAt(change.rangeOffset)
      const range = event.document.getWordRangeAtPosition(
        startPosition,
        /<\/?[a-zA-Z\-]*/
      )
      if (!range) {
        return total
      }
      // TODO more efficient to compute when selection changes?
      const difference = event.document.getText(
        new vscode.Range(range.start, startPosition)
      ).length
      const word = event.document.getText(range)
      const oldWord =
        word.slice(0, difference) +
        previousText.slice(
          change.rangeOffset,
          change.rangeOffset + change.rangeLength
        ) +
        word.slice(difference + change.text.length)
      total.push({
        oldWord,
        word,
        offset: event.document.offsetAt(range.start),
      })
      return total
    }, [] as Tag[])
    previousText = event.document.getText()
    // console.log('changes and text')
    // console.log(event.contentChanges)
    // console.log(event.document.getText())
    doAutoCompletionElementRenameTag(api, tags)
    // previousText = activeTextEditor.document.getText()
  })
}
