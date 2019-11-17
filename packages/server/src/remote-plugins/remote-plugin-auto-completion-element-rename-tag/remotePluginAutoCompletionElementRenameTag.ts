import { doAutoCompletionElementRenameTag } from 'service'
import { RemotePlugin } from '../remotePlugin'
import {
  RequestType,
  TextDocumentIdentifier,
  Position,
} from 'vscode-languageserver'
import { constants } from '../../constants'

type Change = {
  readonly rangeOffset: number
  readonly rangeLength: number
  readonly text: string
}
type Params = {
  readonly textDocument: TextDocumentIdentifier
  readonly changes: Change[]
}
type Result = {
  readonly startOffset: number
  readonly endOffset: number
  readonly word: string
}

const requestType = new RequestType<Params, Result[], any, any>(
  'html-missing-features/auto-completion-element-rename-tag'
)

const unique: <T>(items: T[]) => T[] = <T>(items: T[]) => {
  const seen = new Set<string>()
  const result: T[] = []
  for (const item of items) {
    const stringifiedItem = JSON.stringify(item)
    if (!seen.has(stringifiedItem)) {
      seen.add(stringifiedItem)
      result.push(item)
    }
  }
  return result
}

const irrelevantChangeRE = /^[<>]$/

const isRelevantChange: (change: Change) => boolean = change => {
  return change.rangeLength > 0 || !irrelevantChangeRE.test(change.text)
}

export const remotePluginAutoCompletionElementRenameTag: RemotePlugin = api => {
  api.connectionProxy.onRequest(requestType, ({ textDocument, changes }) => {
    const document = api.documentsProxy.get(textDocument.uri)
    if (!document) {
      return undefined
    }
    const matchingTagPairs = constants.matchingTagPairs[document.languageId]
    if (!matchingTagPairs) {
      throw new Error(
        `missing matching tag pairs for language id ${document.languageId}`
      )
    }
    const relevantChanges = changes.filter(isRelevantChange)
    const text = document.getText()
    const offsets = relevantChanges.map(change => change.rangeOffset)
    const results = offsets.map(offset =>
      doAutoCompletionElementRenameTag(text, offset, matchingTagPairs)
    )
    return unique(results.filter(Boolean)) as Result[]
  })
}
