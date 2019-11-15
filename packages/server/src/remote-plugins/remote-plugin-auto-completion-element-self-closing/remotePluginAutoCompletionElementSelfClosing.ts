import { RemotePlugin } from '../remotePlugin'
import { doAutoCompletionElementSelfClosing } from 'service'
import {
  Range,
  Position,
  RequestType,
  TextDocumentPositionParams,
} from 'vscode-languageserver'

type Result = {
  completionString: string
  completionOffset: number
}

const requestType = new RequestType<
  TextDocumentPositionParams,
  Result | undefined,
  any,
  any
>('html-missing-features/auto-completion-element-self-closing')

export const remotePluginAutoCompletionElementSelfClosing: RemotePlugin = api => {
  api.connectionProxy.onRequest(
    requestType,
    async ({ textDocument, position }) => {
      const document = api.documentsProxy.get(textDocument.uri)
      if (!document) {
        return undefined
      }
      const text = document.getText(
        Range.create(Position.create(0, 0), position)
      )
      const offset = document.offsetAt(position)
      return doAutoCompletionElementSelfClosing(text, offset)
    }
  )
}
