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
  previousOffset: number
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
  // console.log('client version' + document.version)
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
  // console.log('apply ' + results.length + ' results')
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
    // console.log('not applied')
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
    // console.log(JSON.stringify(result))
    // if (!result) {
    //   console.error('no result client')
    //   continue
    // }
    // console.log(typeof result)
    // console.log('(1) set old word to ' + result.originalWord)
    const oldWordAtOffset = wordsAtOffsets[result.originalOffset]
    delete wordsAtOffsets[result.originalOffset]

    let moved = 0
    if (result.originalWord.startsWith('</')) {
      moved = result.endOffset - result.startOffset + 2
    }
    // console.log('set')
    // const newLength = result.originalWord.length
    wordsAtOffsets[result.originalOffset + moved] = {
      newWord: oldWordAtOffset && oldWordAtOffset.newWord,
      oldWord: result.originalWord,
    }
    // console.log('moved ' + moved)
    // console.log(JSON.stringify(wordsAtOffsets))
  }
  lastChangeByAutoRenameTag = {
    fsPath: activeTextEditor.document.uri.fsPath,
    version: activeTextEditor.document.version,
  }
}

let activeTextEditor: vscode.TextEditor | undefined
let latestCancelTokenSource: CancellationTokenSource | undefined
let previousText: string
const tagNameReLeft = /<\/?[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*$/
const tagNameRERight = /^[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*/

let wordsAtOffsets: {
  [offset: string]: {
    oldWord: string
    newWord: string
  }
} = {}

const updateWordsAtOffset: (tags: Tag[]) => void = tags => {
  const keys = Object.keys(wordsAtOffsets)
  if (keys.length > 0) {
    if (keys.length !== tags.length) {
      wordsAtOffsets = {}
    }
    for (const tag of tags) {
      if (!wordsAtOffsets.hasOwnProperty(tag.previousOffset)) {
        wordsAtOffsets = {}
        break
      }
    }
  }
  for (const tag of tags) {
    // console.log('(2) set old word to ' + tag.oldWord)
    wordsAtOffsets[tag.offset] = {
      oldWord:
        (wordsAtOffsets[tag.previousOffset] &&
          wordsAtOffsets[tag.previousOffset].oldWord) ||
        tag.oldWord,
      newWord: tag.word,
    }
    if (tag.previousOffset !== tag.offset) {
      delete wordsAtOffsets[tag.previousOffset]
    }
    tag.oldWord = wordsAtOffsets[tag.offset].oldWord
    // console.log('(2) get old word ' + tag.oldWord)
  }
  // console.log(JSON.stringify(wordsAtOffsets))
}
const doAutoCompletionElementRenameTag: (
  api: LocalPluginApi,
  tags: Tag[]
) => Promise<void> = async (api, tags) => {
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
    console.error('cancel requested')

    return
  }
  if (latestCancelTokenSource === cancelTokenSource) {
    latestCancelTokenSource = undefined
    cancelTokenSource.dispose()
  }
  if (results.length === 0) {
    // console.log(JSON.stringify(wordsAtOffsets))
    // console.error('no results')
    wordsAtOffsets = {}
    // process.exit(1)
    return
  }
  if (!activeTextEditor) {
    return
  }
  const afterVersion = activeTextEditor.document.version
  if (beforeVersion !== afterVersion) {
    // console.log('return 2')
    return
  }
  await applyResults(results)
}

export const localPluginAutoCompletionElementRenameTag: LocalPlugin = api => {
  activeTextEditor = vscode.window.activeTextEditor
  previousText = activeTextEditor && activeTextEditor.document.getText()
  api.vscodeProxy.window.onDidChangeActiveTextEditor(textEditor => {
    // TODO clean up highlights
    activeTextEditor = textEditor
    previousText =
      activeTextEditor.document && activeTextEditor.document.getText()
  })
  api.vscodeProxy.workspace.onDidChangeTextDocument(async event => {
    const currentText = event.document.getText()
    if (!api.utils.isRelevantDocument(event.document)) {
      return
    }
    if (event.contentChanges.length === 0) {
      return
    }
    // console.time('get tags')
    const tags: Tag[] = []
    let totalInserted = 0
    const sortedChanges = event.contentChanges
      .slice()
      .sort((a, b) => a.rangeOffset - b.rangeOffset)
    const keys = Object.keys(wordsAtOffsets)
    // console.log('-------------------------------------')
    for (const change of sortedChanges) {
      for (const key of keys) {
        const parsedKey = parseInt(key, 10)
        if (
          change.rangeOffset <= parsedKey &&
          parsedKey <= change.rangeOffset + change.rangeLength
        ) {
          // console.log('delete' + key)
          delete wordsAtOffsets[key]
        }
      }
      // console.log(JSON.stringify(wordsAtOffsets))
      // console.log('total insert' + totalInserted)
      const line = event.document.lineAt(change.range.start.line)
      const lineStart = event.document.offsetAt(line.range.start)
      const lineChangeOffset = change.rangeOffset - lineStart
      const lineLeft = line.text.slice(0, lineChangeOffset + totalInserted)
      const lineRight = line.text.slice(lineChangeOffset + totalInserted)
      const lineTagNameLeft = lineLeft.match(tagNameReLeft)
      const lineTagNameRight = lineRight.match(tagNameRERight)
      const previousTextRight = previousText.slice(change.rangeOffset)
      const previousTagNameRight = previousTextRight.match(tagNameRERight)

      // console.log(lineTagNameLeft)
      // console.log(lineTagNameRight)

      // console.log(previousTagNameRight)
      // console.log(previousText)
      let newWord: string
      let oldWord: string

      if (!lineTagNameLeft) {
        // console.log('continue')
        totalInserted += change.text.length - change.rangeLength
        continue
      }
      newWord = lineTagNameLeft[0]
      oldWord = lineTagNameLeft[0]
      // console.log('new' + newWord)
      if (lineTagNameRight) {
        newWord += lineTagNameRight[0]
      }
      if (previousTagNameRight) {
        oldWord += previousTagNameRight[0]
      }

      const offset =
        change.rangeOffset - lineTagNameLeft[0].length + totalInserted
      // console.log('new word' + newWord)
      // console.log('old word' + oldWord)
      // console.log('offset' + offset)
      tags.push({
        oldWord,
        word: newWord,
        offset,
        previousOffset: offset - totalInserted,
      })
      totalInserted += change.text.length - change.rangeLength
    }
    // console.log('tags')
    // console.log(JSON.stringify(tags))
    // console.log('\n')
    // console.log(JSON.stringify(wordsAtOffsets))
    // console.timeEnd('get tags')
    updateWordsAtOffset(tags)
    if (tags.length === 0) {
      previousText = currentText
      return
    }
    const beforeVersion = activeTextEditor.document.version
    // the change event is fired before we can update the version of the last change by auto rename tag, therefore we wait for that
    await new Promise(resolve => setImmediate(resolve))
    if (
      lastChangeByAutoRenameTag.fsPath === event.document.uri.fsPath &&
      lastChangeByAutoRenameTag.version === event.document.version
    ) {
      previousText = currentText
      // console.log('return 3')
      return
    }
    const afterVersion = activeTextEditor.document.version
    if (beforeVersion !== afterVersion) {
      // previousText = event.document.getText()
      // console.log('return 1')
      // console.log(event.contentChanges)
      return
    }
    // console.log('-----------------------------------')

    // console.log(
    //   'change' + event.contentChanges[0] && event.contentChanges[0].text
    // )
    previousText = currentText

    // console.log('changes and text')
    // console.log(event.contentChanges)
    // console.log(event.document.getText())
    doAutoCompletionElementRenameTag(api, tags)
    // previousText = activeTextEditor.document.getText()
  })
}
