import {
  TestCase,
  createTestFile,
  run,
  activateExtension,
  slowTimeout,
} from '../test-utils'
import { before } from 'mocha'

suite('Close Tag', () => {
  before(async () => {
    await createTestFile('close-tag.html')
    await activateExtension()
  })

  test('basic', async () => {
    const testCases: TestCase[] = [
      {
        input: '|',
        type: '>',
        expect: '>',
      },
      {
        input: '<div>',
        type: '</',
        expect: '<div></div>',
        skip: true,
      },
      {
        input: '<div>\n\n|',
        type: '</',
        expect: '<div>\n\n</div>',
        skip: true,
      },
    ]
    await run(testCases, { timeout: slowTimeout })
  })
})
