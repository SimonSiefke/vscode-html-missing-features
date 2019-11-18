import * as vscode from 'vscode'
import * as path from 'path'
import { activateExtension, TestCase, run, slowTimeout } from '../../test-utils'

const getUri: (file: string) => vscode.Uri = file =>
  vscode.Uri.file(
    path.join(__dirname, 'language-typescriptreact-workspace-dist', file)
  )

test('language typescriptreact', async () => {
  await activateExtension()
  const document = await vscode.workspace.openTextDocument(getUri('index.tsx'))
  await vscode.window.showTextDocument(document)
  const testCases: TestCase[] = [
    {
      input: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <a target="_blank" href="blabla.com">
    Bla Bla
</a>`,
      selection: [47, 57],
      type: 'any',
      expect: `interface Props {
	readonly dispatch: Dispatch<any>;
}

const Link = <a target="_blank" href="blabla.com">
    Bla Bla
</a>`,
    },
    {
      input: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <a| target="_blank" href="blabla.com">
    Bla Bla
</a>`,
      type: 'a',
      expect: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <aa target="_blank" href="blabla.com">
    Bla Bla
</aa>`,
    },
    {
      input: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <a target="_blank" href="blabla.com">
    Bla Bla
</a|>`,
      type: 'a',
      expect: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <aa target="_blank" href="blabla.com">
    Bla Bla
</aa>`,
    },
  ]
  await run(testCases, {
    timeout: slowTimeout,
  })
})
