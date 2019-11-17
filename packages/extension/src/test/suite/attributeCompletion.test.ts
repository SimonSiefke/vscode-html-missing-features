import {
  TestCase,
  createTestFile,
  run,
  activateExtension,
  ciSlowNess,
  slowSpeed,
} from '../test-utils'
import { before } from 'mocha'

const timeout = 300 * ciSlowNess

suite('Attribute Completion', () => {
  before(async () => {
    await createTestFile('attribute-completion.html')
    await activateExtension()
  })

  test('input - type', async () => {
    const testCases: TestCase[] = [
      {
        input: '<input |',
        type: 'ty',
        expect: '<input type=""',
      },
      {
        input: '<input |',
        type: 'ty',
        expect: '<input type=""',
      },
      {
        input: '<input |',
        type: 'tdl',
        expect: '<input type="datetime-local"',
      },
      {
        input: '<input |',
        type: 'tt',
        expect: '<input type="tel"',
      },
      {
        input: '<input |',
        type: 'tti',
        expect: '<input type="time"',
      },
      {
        input: '<input |',
        type: 'tf',
        expect: '<input type="file"',
      },
      {
        input: '<input |',
        type: 'file',
        expect: '<input type="file"',
        skip: true,
      },
    ]
    await run(testCases, {
      timeout,
      speed: slowSpeed,
      afterCommands: [
        'editor.action.triggerSuggest',
        'acceptSelectedSuggestion',
      ],
    })
  })

  test.skip('ol - type - tabindex', async () => {
    const testCases: TestCase[] = [
      {
        input: '<ol |',
        type: 't',
        expect: '<ol tabindex=""',
      },
      {
        input: '<ol |',
        type: 'ty',
        expect: '<ol type=""',
      },
      {
        input: '<ol |',
        type: 't1',
        expect: '<ol type="1"',
      },
    ]
    await run(testCases, {
      timeout,
      speed: slowSpeed,
      afterCommands: [
        'editor.action.triggerSuggest',
        'acceptSelectedSuggestion',
      ],
    })
  })

  test('img - class - crossorigin', async () => {
    const testCases: TestCase[] = [
      {
        input: '<img |',
        type: 'c',
        expect: '<img class=""',
      },
      {
        input: '<img |',
        type: 'cr',
        expect: '<img crossorigin=""',
        skip: true,
      },
      {
        input: '<img |',
        type: 'cra',
        expect: '<img crossorigin="anonymous"',
        skip: true,
      },
      {
        input: '<img |',
        type: 'cru',
        expect: '<img crossorigin="use-credentials"',
        skip: true,
      },
    ]
    await run(testCases, {
      timeout,
      speed: slowSpeed,
      afterCommands: [
        'editor.action.triggerSuggest',
        'acceptSelectedSuggestion',
      ],
    })
  })

  test('button - dir - disabled', async () => {
    const testCases: TestCase[] = [
      {
        input: '<button |',
        type: 'di',
        expect: '<button dir=""',
      },
      {
        input: '<button |',
        type: 'dis',
        expect: '<button disabled',
      },
      {
        input: '<button disabled|',
        type: '=',
        expect: '<button disabled=""',
        afterTypeCommands: [],
      },
    ]
    await run(testCases, {
      timeout,
      afterCommands: [
        'editor.action.triggerSuggest',
        'acceptSelectedSuggestion',
      ],
    })
  })

  test('textarea - autocapitalize', async () => {
    const testCases: TestCase[] = [
      {
        input: '<textarea |',
        type: 'auto',
        expect: '<textarea autocapitalize=""',
        skip: true,
      },
      {
        input: '<textarea |',
        type: 'ao',
        expect: '<textarea autocapitalize="off"',
      },
    ]
    await run(testCases, {
      timeout,
      afterCommands: [
        'editor.action.triggerSuggest',
        'acceptSelectedSuggestion',
      ],
    })
  })

  test('div - class', async () => {
    const testCases: TestCase[] = [
      {
        input: '<div |',
        type: 'c',
        expect: '<div class=""',
      },
    ]
    await run(testCases, {
      timeout,
      afterCommands: [
        'editor.action.triggerSuggest',
        'acceptSelectedSuggestion',
      ],
    })
  })
})
