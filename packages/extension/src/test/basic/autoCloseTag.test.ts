import {
  TestCase,
  createTestFile,
  run,
  activateExtension,
  slowTimeout,
} from '../test-utils'
import { before } from 'mocha'
// TODO use deindent from typescript

suite('Auto Close Tag', () => {
  before(async () => {
    await createTestFile('auto-close-tag.html')
    await activateExtension()
  })

  test('basic', async () => {
    const testCases: TestCase[] = [
      {
        input: '|',
        type: '<div>',
        expect: '<div>\n  \n</div>',
      },
      {
        input: '<div>\n  |\n</div>',
        type: '<ul>',
        expect: '<div>\n  <ul>\n    \n  </ul>\n</div>',
      },
      {
        input: '|',
        type: '<input>',
        expect: '<input>',
      },
      {
        input: '|',
        type: '<div>\n<img src="https://source.unsplash.com/random"></div>',
        expect: '<div>\n<img src="https://example.jpg"></div>',
        skip: true,
      },
      {
        input: '|',
        type: '<!DOCTYPE html>',
        expect: '<!DOCTYPE html>',
      },
      {
        input: '|',
        type: '<!doctype html>',
        expect: '<!doctype html>',
      },
    ]
    await run(testCases, { timeout: slowTimeout })
  })

  test('multicursor', async () => {
    const testCases: TestCase[] = [
      {
        input: `
<h1|
<h2|
<h3|
<h4|
<h5|
<h6|
`.trimStart(),
        type: '>',
        expect: `
<h1></h1>
<h2></h2>
<h3></h3>
<h4></h4>
<h5></h5>
<h6></h6>
`.trimStart(),
      },
      {
        input: `
<div|
<div|
<div|
<div|
<div|
<div|
`.trimStart(),
        type: '>',
        expect: `
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
`.trimStart(),
      },
      {
        type: '<button>',
        expect: `
<div><button></button></div>
<div><button></button></div>
<div><button></button></div>
<div><button></button></div>
<div><button></button></div>
<div><button></button></div>
`.trimStart(),
      },
    ]
    await run(testCases, { timeout: slowTimeout })
  })
})
