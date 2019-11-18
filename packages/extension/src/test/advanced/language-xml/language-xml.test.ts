import * as vscode from 'vscode'
import * as path from 'path'
import { activateExtension, TestCase, run, slowTimeout } from '../../test-utils'

const getUri: (file: string) => vscode.Uri = file =>
  vscode.Uri.file(path.join(__dirname, 'language-xml-workspace-dist', file))

test('language xml', async () => {
  await activateExtension()
  const document = await vscode.workspace.openTextDocument(getUri('index.xml'))
  await vscode.window.showTextDocument(document)
  const testCases: TestCase[] = [
    {
      input: `<?xml| version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <student>
      <name>Tanmay</name>
      <grade>A</grade>
   </student>
</class_list>`,
      type: 'l',
      expect: `<?xmll version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <student>
      <name>Tanmay</name>
      <grade>A</grade>
   </student>
</class_list>`,
    },
    {
      input: `<?xml version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <student|>
      <name>Tanmay</name>
      <grade>A</grade>
   </student>
</class_list>`,
      type: 't',
      expect: `<?xml version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <studentt>
      <name>Tanmay</name>
      <grade>A</grade>
   </studentt>
</class_list>`,
    },
  ]
  await run(testCases, {
    timeout: slowTimeout,
  })
})
