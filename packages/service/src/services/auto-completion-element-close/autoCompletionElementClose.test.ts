// import { doAutoCompletionElementClose } from './autoCompletionElementClose'

// // TODO

// const testCases: { input: string; expected: string | undefined }[] = [
//   {
//     input: '<a href="/|"',
//     expected: undefined,
//   },
//   {
//     input: '<h1></|',
//     expected: '<h1></h1>',
//   },
//   {
//     input: '<h1> </|',
//     expected: '<h1> </h1>',
//   },
//   {
//     input: '<h1>hello world</|',
//     expected: '<h1>hello world</h1>',
//   },
//   {
//     input: '<h1><!-- <h2> --></|',
//     expected: '<h1><!-- <h2> --></h1>',
//   },
//   {
//     input: '<h1><!-- </h1> --> <!-- <h2> --></|',
//     expected: '<h1><!-- </h1> --> <!-- <h2> --></h1>',
//   },
//   {
//     input: '<h1><!-- </h1> --><!-- <h2> --></|',
//     expected: '<h1><!-- </h1> --><!-- <h2> --></h1>',
//   },
//   {
//     input: '<!-- <h1> --> </|',
//     expected: undefined,
//   },
// ]

// test.each(testCases)('auto-completion-element-close %o', testCase => {
//   const offset = testCase.input.indexOf('|')
//   expect(offset).toBeGreaterThan(-1)
//   const text = testCase.input.replace('|', '')
//   const result = doAutoCompletionElementClose(text, offset)
//   if (testCase.expected === undefined) {
//     expect(result).toBe(undefined)
//   } else {
//     expect(result).toBeDefined()
//     expect(text + (result && result.completionString)).toBe(testCase.expected)
//   }
// })
