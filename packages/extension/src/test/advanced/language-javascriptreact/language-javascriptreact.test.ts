import * as vscode from 'vscode'
import * as path from 'path'
import { activateExtension, TestCase, run, slowTimeout } from '../../test-utils'

const getUri: (file: string) => vscode.Uri = file =>
  vscode.Uri.file(
    path.join(__dirname, 'language-javascriptreact-workspace-dist', file)
  )

test('language javascriptreact', async () => {
  await activateExtension()
  const document = await vscode.workspace.openTextDocument(getUri('index.jsx'))
  await vscode.window.showTextDocument(document)
  const testCases: TestCase[] = [
    {
      input: `const button = <button|>{/* </button> */}</button>;`,
      type: 'n',
      expect: `const button = <buttonn>{/* </button> */}</buttonn>;`,
    },
    {
      input: `const button = <button>{/* </button|> */}</button>;`,
      type: 'n',
      expect: `const button = <button>{/* </buttonn> */}</button>;`,
      skip: true,
    },
    {
      input: `const button = <button>{/* </button> */}</button|>;`,
      type: 'n',
      expect: `const button = <buttonn>{/* </button> */}</buttonn>;`,
    },
    {
      input: 'const button = <button|>{/* <button> */}</button>',
      type: 'n',
      expect: 'const button = <buttonn>{/* <button> */}</buttonn>',
    },
    {
      input: 'const button = <button>{/* <button|> */}</button>',
      type: 'n',
      expect: 'const button = <buttonn>{/* <buttonn> */}</button>',
      skip: true,
    },
    {
      input: 'const button = <button>{/* <button> */}</button|>',
      type: 'n',
      expect: 'const button = <buttonn>{/* <button> */}</buttonn>',
      skip: true,
    },
  ]
  await run(testCases, {
    timeout: slowTimeout,
  })
})
