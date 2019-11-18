import * as vscode from 'vscode'
import * as path from 'path'
import { activateExtension, TestCase, run, slowTimeout } from '../../test-utils'

const getUri: (file: string) => vscode.Uri = file =>
  vscode.Uri.file(path.join(__dirname, 'language-svelte-workspace-dist', file))

test('language svelte', async () => {
  await activateExtension()
  const document = await vscode.workspace.openTextDocument(
    getUri('index.svelte')
  )
  await vscode.window.showTextDocument(document)
  const testCases: TestCase[] = [
    {
      input: `<script>
	let count = 1;

	function handleClick() {
		count += 1;
	}
</script>

<button| on:click={handleClick}>
	Count: {count}
</button>`,
      type: '2',
      expect: `<script>
	let count = 1;

	function handleClick() {
		count += 1;
	}
</script>

<button2 on:click={handleClick}>
	Count: {count}
</button2>`,
    },
  ]
  await run(testCases, {
    timeout: slowTimeout,
  })
})
