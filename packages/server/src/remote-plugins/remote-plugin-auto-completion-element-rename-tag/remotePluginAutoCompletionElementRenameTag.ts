import { doAutoCompletionElementRenameTag } from 'service'
import { RemotePlugin } from '../remotePlugin'
import {
  RequestType,
  TextDocumentIdentifier,
  Position,
} from 'vscode-languageserver'

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

export const remotePluginAutoCompletionElementRenameTag: RemotePlugin = api => {
  api.connectionProxy.onRequest(requestType, ({ textDocument, positions }) => {
    const document = api.documentsProxy.get(textDocument.uri)
    if (!document) {
      return undefined
    }
    const text = document.getText()
    const offsets = positions.map(position => document.offsetAt(position))
    const results = offsets.map(offset =>
      doAutoCompletionElementRenameTag(text, offset)
    )
    return unique(results.filter(Boolean)) as Result[]
  })
}
