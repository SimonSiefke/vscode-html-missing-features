import * as vscode from 'vscode'
import * as path from 'path'
import { activateExtension, TestCase, run, slowTimeout } from '../../test-utils'

const getUri: (file: string) => vscode.Uri = file =>
  vscode.Uri.file(path.join(__dirname, 'language-ruby-workspace-dist', file))

test('language ruby', async () => {
  await activateExtension()
  const document = await vscode.workspace.openTextDocument(getUri('index.erb'))
  await vscode.window.showTextDocument(document)
  const testCases: TestCase[] = [
    {
      input: `<span|><%= project.logo_tag %> <%= project.name %></span>`,
      type: 'n',
      expect: `<spann><%= project.logo_tag %> <%= project.name %></spann>`,
    },
  ]
  await run(testCases, {
    timeout: slowTimeout,
  })
})
