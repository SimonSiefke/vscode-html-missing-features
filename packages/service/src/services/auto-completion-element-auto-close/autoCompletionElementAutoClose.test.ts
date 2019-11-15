import { doAutoCompletionElementAutoClose } from './autoCompletionElementAutoClose'
import { replaceConfigs } from '../../Data/Data'

beforeAll(() => {
  replaceConfigs(
    [
      {
        tags: {
          h1: {
            newline: false,
          },
          Daten: {
            newline: false,
          },
          DatenSätze: {
            newline: false,
          },
          input: {
            selfClosing: true,
          },
          ul: {
            newline: true,
          },
        },
      },
    ],
    'test'
  )
})

test('auto-completion-element-auto-close', () => {
  const testCases: { input: string; expected: string | undefined }[] = [
    {
      input: '<h1>|',
      expected: '<h1>$0</h1>',
    },
    {
      input: '<h1></h1>|',
      expected: undefined,
    },
    {
      input: '<input>|',
      expected: undefined,
    },

    {
      input: '<ul>|',
      expected: '<ul>\n\t$0\n</ul>',
    },
    {
      input: '<Daten>|',
      expected: '<Daten>$0</Daten>',
    },
    {
      input: '<DatenSätze>|',
      expected: '<DatenSätze>$0</DatenSätze>',
    },
    {
      input: '<🚀>|',
      expected: undefined,
    },
    {
      input: '<button/>|',
      expected: undefined,
    },
    {
      input: '<!---->|',
      expected: undefined,
    },
    {
      input: '<button />|',
      expected: undefined,
    },
    {
      input: '<div>abc</div>|',
      expected: undefined,
    },
    {
      input: '<div>Abc</div>|',
      expected: undefined,
    },
    {
      input: '<div>abc12</div>|',
      expected: undefined,
    },
    {
      input: '<div>abc.</div>|',
      expected: undefined,
    },
    {
      input: '<div>(div)</div>|',
      expected: undefined,
    },
    {
      input: '<div>($db)</div>|',
      expected: undefined,
    },
    {
      input: '<div>($db.)</div>|',
      expected: undefined,
    },
    {
      input: '<div>ul::l</div>|',
      expected: undefined,
    },
    {
      input: '<div|',
      expected: undefined,
    },
    {
      input: '<div>ul:</div>|',
      expected: undefined,
    },
  ]

  for (const testCase of testCases) {
    const offset = testCase.input.indexOf('|')
    expect(offset).toBeGreaterThan(-1)
    const text = testCase.input.replace('|', '')
    const result = doAutoCompletionElementAutoClose(text, offset)
    if (testCase.expected === undefined) {
      expect(result).toBe(undefined)
    } else {
      expect(result).toBeDefined()
      expect(text + (result && result.completionString)).toBe(testCase.expected)
    }
  }
})
