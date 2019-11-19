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
    const relevantChanges = changes
      .filter(isRelevantChange)
      .sort((a, b) => a.rangeOffset - b.rangeOffset)
    const text = document.getText()
    /**
     * actual cursor offset depends on the inserted text, e.g.
     * <h1|></h1>
     * <h2|></h2>
     * <h3|></h3>
     * <h4|></h4>
     * <h5|></h5>
     * <h6|></h6>
     * when typing "i" it becomes
     * <h1i></h1>
     * <h2i></h2>
     * <h3i></h3>
     * <h4i></h4>
     * <h5i></h5>
     * <h6i></h6>
     * the rangeOffsets are [3, 13, 23, 33, 43, 53], however because "i" was inserted
     * the actual cursor offsets are now [3, 14, 25, 36, 47, 58]
     *
     */
    const offsets = []
    let totalInserted = 0
    for (const change of relevantChanges) {
      offsets.push(totalInserted + change.rangeOffset)
      totalInserted += change.text.length - change.rangeLength
    }
    const results = offsets.map(offset =>
      doAutoCompletionElementRenameTag(text, offset, document.languageId)
    )
    return unique(results.filter(Boolean)) as Result[]
  })
}
