import * as vscode from 'vscode'
import { LocalPlugin } from '../localPlugin'
import {
  RequestType,
  Range,
  TextDocumentIdentifier,
} from 'vscode-languageclient'
import { LocalPluginApi } from '../../local-plugin-api/localPluginApi'

type Result = {
  completionString: string
  completionRange: Range
}

type Params = {
  textDocument: TextDocumentIdentifier
  selection: Range
}

const requestType = new RequestType<Params, Result, any, any>(
  'html-missing-features/wrap-selection-with-tag'
)

const askServerForWrapSelectionWithTag: (
  api: LocalPluginApi,
  document: vscode.TextDocument,
  selectedRange: vscode.Range
) => Promise<Result> = async (api, document, selectedRange) => {
  const params: Params = {
    textDocument: api.languageClientProxy.code2ProtocolConverter.asTextDocumentIdentifier(
      document
    ),
    selection: api.languageClientProxy.code2ProtocolConverter.asRange(
      selectedRange
    ),
  }
  const result = await api.languageClientProxy.sendRequest(requestType, params)
  // TODO duplicate code below
  if (
    !vscode.window.activeTextEditor ||
    vscode.window.activeTextEditor.document.version !== document.version
  ) {
    throw new Error('too slow')
  }
  return result
}

const applyResults: (results: Result[]) => Promise<void> = async results => {
  const relevantResults = results.filter(Boolean).map(result => ({
    completionString: result.completionString,
    range: new vscode.Range(
      new vscode.Position(
        result.completionRange.start.line,
        result.completionRange.start.character
      ),
      new vscode.Position(
        result.completionRange.end.line,
        result.completionRange.end.character
      )
    ),
  }))
  await Promise.all(
    relevantResults.map(async result => {
      await vscode.window.activeTextEditor.insertSnippet(
        new vscode.SnippetString(result.completionString),
        result.range
      )
    })
  )
}

export const localPluginWrapSelectionWithTag: LocalPlugin = api => {
  api.vscodeProxy.commands.registerTextEditorCommand(
    'htmlMissingFeatures.wrap-selection-with-tag',
    async textEditor => {
      // TODO many of these results can be optimized by sending 1 request to the server with all the selections
      const results = await Promise.all(
        textEditor.selections.map(selection =>
          askServerForWrapSelectionWithTag(api, textEditor.document, selection)
        )
      )
      applyResults(results)
    }
  )
}
