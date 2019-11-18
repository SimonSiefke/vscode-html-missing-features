import * as vscode from 'vscode'
import * as path from 'path'
import { activateExtension, TestCase, run, slowTimeout } from '../../test-utils'

const getUri: (file: string) => vscode.Uri = file =>
  vscode.Uri.file(path.join(__dirname, 'language-svg-workspace-dist', file))

test('language svg', async () => {
  await activateExtension()
  const document = await vscode.workspace.openTextDocument(getUri('index.svg'))
  await vscode.window.showTextDocument(document)
  const testCases: TestCase[] = [
    {
      input: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg| xmlns="http://www.w3.org/2000/svg" width="500" height="500">
<circle cx="250" cy="250" r="210" fill="#fff" stroke="#000" stroke-width="8"/>
</svg>
`,
      type: '2',
      expect: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg2 xmlns="http://www.w3.org/2000/svg" width="500" height="500">
<circle cx="250" cy="250" r="210" fill="#fff" stroke="#000" stroke-width="8"/>
</svg2>
`,
    },
  ]
  await run(testCases, {
    timeout: slowTimeout,
  })
})
