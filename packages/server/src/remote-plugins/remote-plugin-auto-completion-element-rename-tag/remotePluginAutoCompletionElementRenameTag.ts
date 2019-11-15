import { doAutoCompletionElementRenameTag } from '@html-language-features/html-language-service'
import { RemotePlugin } from '../remotePlugin'
import {
  RequestType,
  TextDocumentIdentifier,
  Position,
} from 'vscode-languageserver'
import { uniqBy } from 'lodash'

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
    return uniqBy(results.filter(Boolean), JSON.stringify) as Result[]
  })
}
