import { RemotePlugin } from '../remotePlugin'
import { RequestType, TextDocumentPositionParams } from 'vscode-languageserver'

type Result = {
  completionString: string
  completionOffset: number
}

const requestType = new RequestType<
  TextDocumentPositionParams,
  Result | undefined,
  any,
  any
>('html-missing-features/auto-completion-insert-quotes-after-equal-sign')

const enabledLanguageIds = ['html', 'php']

export const remotePluginAutoCompletionInsertQuotesAfterEqualSign: RemotePlugin = api => {
  api.connectionProxy.onRequest(requestType, ({ textDocument, position }) => {
    const document = api.documentsProxy.get(textDocument.uri)
    if (!document) {
      return undefined
    }
    if (!enabledLanguageIds.includes(document.languageId)) {
      return undefined
    }
    const text = document.getText()
    const offset = document.offsetAt(position)
    return {
      completionString: `"\${0}"`,
      completionOffset: offset,
    }
  })
}
