import { doAutoCompletionElementSelfClosing } from './autoCompletionElementSelfClosing'

test('completion-element-self-closing', () => {
  const testCases: { input: string; expected: string | undefined }[] = [
    // TODO bug
    // {
    //   input: '<a href="/|"',
    //   expected: undefined,
    // },
    {
      input: '<|',
      expected: undefined,
    },
    {
      input: '<h1|',
      expected: undefined,
    },
    {
      input: '<h1>|',
      expected: undefined,
    },
    {
      input: '<h1><|',
      expected: undefined,
    },
    {
      input: '<h1/|',
      expected: '<h1/>',
    },
    {
      input: '<h1>|',
      expected: undefined,
    },
    {
      input: '<h1></|',
      expected: undefined,
    },
    {
      input: '<Daten/|',
      expected: '<Daten/>',
    },
    {
      input: '<DatenSätze/|',
      expected: '<DatenSätze/>',
    },
    {
      input: '<🚀/|',
      expected: undefined,
    },
  ]

  for (const testCase of testCases) {
    const offset = testCase.input.indexOf('|')
    expect(offset).toBeGreaterThan(-1)
    const text = testCase.input.replace('|', '')
    const result = doAutoCompletionElementSelfClosing(text, offset)
    if (testCase.expected === undefined) {
      expect(result).toBe(undefined)
    } else {
      expect(result).toBeDefined()
      expect(
        text.slice(0, result && result.completionOffset) +
          (result && result.completionString)
      ).toBe(testCase.expected)
    }
  }
})
