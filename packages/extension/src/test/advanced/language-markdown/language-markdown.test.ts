import * as vscode from 'vscode'
import * as path from 'path'
import { activateExtension, TestCase, run, slowTimeout } from '../../test-utils'

const getUri: (file: string) => vscode.Uri = file =>
  vscode.Uri.file(
    path.join(__dirname, 'language-markdown-workspace-dist', file)
  )

test('language markdown', async () => {
  await activateExtension()
  const document = await vscode.workspace.openTextDocument(getUri('index.md'))
  await vscode.window.showTextDocument(document)
  const testCases: TestCase[] = [
    {
      input: `\`\`\`html
<button|>
</button>
\`\`\``,
      type: 'n',
      expect: `\`\`\`html
<buttonn>
</buttonn>
\`\`\``,
    },
    {
      input: `\`\`\`html
<button|>
\`\`\`

\`\`\`html
</button>
\`\`\``,
      type: 'n',
      expect: `\`\`\`html
<buttonn>
\`\`\`

\`\`\`html
</button>
\`\`\``,
    },
    {
      input: `\`\`\`html
<button>
\`\`\`

\`\`\`html
</button|>
\`\`\``,
      type: 'n',
      expect: `\`\`\`html
<button>
\`\`\`

\`\`\`html
</buttonn>
\`\`\``,
      skip: true,
    },
  ]
  await run(testCases, {
    timeout: slowTimeout,
  })
})
