import * as vscode from 'vscode'
import * as path from 'path'
import { activateExtension, TestCase, run, slowTimeout } from '../../test-utils'

const getUri: (file: string) => vscode.Uri = file =>
  vscode.Uri.file(path.join(__dirname, 'language-php-workspace-dist', file))

test('language php', async () => {
  await activateExtension()
  const document = await vscode.workspace.openTextDocument(getUri('index.php'))
  await vscode.window.showTextDocument(document)
  const testCases: TestCase[] = [
    {
      input: `<div| class = 'bg-warning'>
  <!-- </div> -->
  <?php displayErrors($errors); ?>
</div>`,
      type: 'v',
      expect: `<divv class = 'bg-warning'>
  <!-- </div> -->
  <?php displayErrors($errors); ?>
</divv>`,
    },
  ]
  await run(testCases, {
    timeout: slowTimeout,
  })
})
