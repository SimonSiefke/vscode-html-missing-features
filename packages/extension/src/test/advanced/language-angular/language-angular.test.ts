import * as vscode from 'vscode'
import * as path from 'path'
import { activateExtension, TestCase, run, slowTimeout } from '../../test-utils'

const getUri: (file: string) => vscode.Uri = file =>
  vscode.Uri.file(path.join(__dirname, 'language-angular-workspace-dist', file))

test('language angular', async () => {
  await activateExtension()
  const document = await vscode.workspace.openTextDocument(getUri('index.jsx'))
  await vscode.window.showTextDocument(document)
  const testCases: TestCase[] = []
  await run(testCases, {
    timeout: slowTimeout,
  })
})
