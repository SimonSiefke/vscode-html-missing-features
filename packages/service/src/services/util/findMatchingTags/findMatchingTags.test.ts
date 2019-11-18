// import { findMatchingTags, MatchingTagResult } from './findMatchingTags'

// interface MatchingTagRegion {
//   start: number
//   end: number
//   result: MatchingTagResult | undefined
// }

// const expectRegions: (
//   text: string,
//   expectedRegions: MatchingTagRegion[]
// ) => void = (text, expectedRegions) => {
//   let previousRegion: MatchingTagRegion | undefined
//   if (text.length > 0) {
//     expect(expectedRegions.length).toBeGreaterThan(0)
//   }
//   for (let j = 0; j < expectedRegions.length; j++) {
//     const region = expectedRegions[j]
//     if (previousRegion) {
//       expect(previousRegion.end + 1).toBe(region.start)
//     } else {
//       expect(region.start).toBe(0)
//     }
//     previousRegion = region
//     for (let i = region.start; i <= region.end; i++) {
//       expect(findMatchingTags(text, i)).toEqual(region.result)
//     }
//   }
// }

// test('works with nothing passed', () => {
//   const text = ''
//   const regions: MatchingTagRegion[] = [
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test.skip('works with just > symbol', () => {
//   // TODO stackoverflow error
//   const text = '>'
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('ignore non tag content', () => {
//   const text = 'before<div>inside</div>after'
//   const expectedDiv: MatchingTagResult = {
//     type: 'startAndEndTag',
//     startTagOffset: 6,
//     endTagOffset: 17,
//     tagName: 'div',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 5,
//       result: undefined,
//     },
//     {
//       start: 6,
//       end: 10,
//       result: expectedDiv,
//     },
//     {
//       start: 11,
//       end: 16,
//       result: undefined,
//     },
//     {
//       start: 17,
//       end: 22,
//       result: expectedDiv,
//     },
//     {
//       start: 23,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('minimal self closing tag', () => {
//   const text = '<div/>'
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: text.length - 1,
//       result: {
//         type: 'onlyStartTag',
//         tagName: 'div',
//         startTagOffset: 0,
//       },
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('self closing tag with whitespace', () => {
//   const text = 'nonimportant<div />nonimportant'
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 11,
//       result: undefined,
//     },
//     {
//       start: 12,
//       end: 18,
//       result: {
//         tagName: 'div',
//         type: 'onlyStartTag',
//         startTagOffset: 12,
//       },
//     },
//     {
//       start: 19,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('simple opening and closing tag', () => {
//   const text = '<div>content</div>'
//   const expectedDiv: MatchingTagResult = {
//     tagName: 'div',
//     type: 'startAndEndTag',
//     startTagOffset: 0,
//     endTagOffset: 12,
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 4,
//       result: expectedDiv,
//     },
//     {
//       start: 5,
//       end: 11,
//       result: undefined,
//     },
//     {
//       start: 12,
//       end: 17,
//       result: expectedDiv,
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test.skip('simple nested tags', () => {
//   const text = '<div><span><self-closing /></span></div>'
//   const expectedDiv: MatchingTagResult = {
//     type: 'startAndEndTag',
//     startTagOffset: 0,
//     endTagOffset: 34,
//     tagName: 'div',
//   }
//   const expectedSpan: MatchingTagResult = {
//     type: 'startAndEndTag',
//     startTagOffset: 5,
//     endTagOffset: 27,
//     tagName: 'span',
//   }
//   const expectedSelfClosing: MatchingTagResult = {
//     type: 'onlyStartTag',
//     tagName: 'self-closing',
//     startTagOffset: 11,
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 4,
//       result: expectedDiv,
//     },
//     {
//       start: 5,
//       end: 10,
//       result: expectedSpan,
//     },
//     {
//       start: 11,
//       end: 26,
//       result: expectedSelfClosing,
//     },
//     {
//       start: 27,
//       end: 33,
//       result: expectedSpan,
//     },
//     // TODO bug should be div
//     {
//       start: 34,
//       end: 34,
//       result: undefined,
//     },
//     // {
//     //   start: 34,
//     //   end: 34,
//     //   result: expectedDiv,
//     // },
//     // {
//     //   start: 38,
//     //   end: text.length,
//     //   result: undefined,
//     // },
//   ]
//   expectRegions(text, regions)
// })

// test('simple tag with attributes', () => {
//   const text = '<div attribute attribute="value">content</div>'
//   const expectedDiv: MatchingTagResult = {
//     tagName: 'div',
//     startTagOffset: 0,
//     endTagOffset: 40,
//     type: 'startAndEndTag',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 32,
//       result: expectedDiv,
//     },
//     {
//       start: 33,
//       end: 39,
//       result: undefined,
//     },
//     {
//       start: 40,
//       end: 45,
//       result: expectedDiv,
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test.skip('tag as an attribute value', () => {
//   const text = '<div attribute={<span>content</span>}>content</div>'
//   const expectedDiv: MatchingTagResult = {
//     tagName: 'div',
//     type: 'startAndEndTag',
//     startTagOffset: 0,
//     endTagOffset: 41,
//   }
//   const expectedSpan: MatchingTagResult = {
//     tagName: 'span',
//     type: 'startAndEndTag',
//     startTagOffset: 15,
//     endTagOffset: 21,
//   }
//   const regions: MatchingTagRegion[] = []
//   expectRegions(text, regions)
// })

// test.skip('tag deep in the attribute value', () => {
//   const text = `<x a={f(
//           <s cmp={
//             <>content<a></a></>
//           }>s content</s>
//         )}>x content</x>`

//   const regions: MatchingTagRegion[] = []
//   expectRegions(text, regions)
// })

// test.skip('React fragments', () => {
//   const text = 'text<>content</>text'
//   const expectedFragment: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: '',
//     startTagOffset: 4,
//     endTagOffset: 14,
//   }
//   const regions: MatchingTagRegion[] = []
//   expectRegions(text, regions)
// })

// test.skip('unopened tag', () => {
//   const text = '<a><b></c></b></a>'
//   const expectedA: MatchingTagResult = {
//     type: 'startAndEndTag',
//     startTagOffset: 0,
//     endTagOffset: 16,
//     tagName: 'a',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 2,
//       result: expectedA,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('unclosed tag', () => {
//   const text = '<div><input type="button"></div>'
//   const expectedDiv: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'div',
//     startTagOffset: 0,
//     endTagOffset: 26,
//   }
//   const expectedInput: MatchingTagResult = {
//     type: 'onlyStartTag',
//     startTagOffset: 5,
//     tagName: 'input',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 4,
//       result: expectedDiv,
//     },
//     {
//       start: 5,
//       end: 25,
//       result: expectedInput,
//     },
//     {
//       start: 26,
//       end: 31,
//       result: expectedDiv,
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test.skip('unclosed tag inside attribute', () => {
//   const text = '<div attr={<input type="button">}></div>'
//   const expectedDiv: MatchingTagResult = {
//     tagName: 'div',
//     startTagOffset: 0,
//     endTagOffset: 62,
//     type: 'startAndEndTag',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 4,
//       result: expectedDiv,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('can match from opening and closing tag', () => {
//   const data = '<a>a</a>\na'
//   const expected: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'a',
//     startTagOffset: 0,
//     endTagOffset: 4,
//   }
//   expect(findMatchingTags(data, 0)).toEqual(expected)
//   expect(findMatchingTags(data, 1)).toEqual(expected)
//   expect(findMatchingTags(data, 2)).toEqual(expected)
//   expect(findMatchingTags(data, 3)).toEqual(undefined)
//   expect(findMatchingTags(data, 4)).toEqual(expected)
//   expect(findMatchingTags(data, 5)).toEqual(expected)
//   expect(findMatchingTags(data, 6)).toEqual(expected)
//   expect(findMatchingTags(data, 7)).toEqual(expected)
//   expect(findMatchingTags(data, 8)).toEqual(undefined)
//   expect(findMatchingTags(data, 9)).toEqual(undefined)
//   expect(findMatchingTags(data, 10)).toEqual(undefined)
// })

// test.skip('can match nested with invalid tags', () => {
//   const data = '<a><b></c></b>'
//   const expected = {
//     opening: { name: 'b', start: 3, end: 6 },
//     closing: { name: 'b', start: 10, end: 14 },
//   }
//   expect(findMatchingTags(data, 0)).toEqual(undefined)
//   expect(findMatchingTags(data, 4)).toEqual(expected)
//   expect(findMatchingTags(data, 12)).toEqual(expected)
//   expect(findMatchingTags(data, 1)).toEqual(undefined)
//   expect(findMatchingTags(data, 8)).toEqual(undefined)
// })

// test('unclosed start tags', () => {
//   const data = '<a>a'
//   const expected: MatchingTagResult = {
//     type: 'onlyStartTag',
//     tagName: 'a',
//     startTagOffset: 0,
//   }
//   expect(findMatchingTags(data, 0)).toEqual(expected)
//   expect(findMatchingTags(data, 1)).toEqual(expected)
//   expect(findMatchingTags(data, 2)).toEqual(expected)
//   expect(findMatchingTags(data, 3)).toEqual(undefined)
//   expect(findMatchingTags(data, 4)).toEqual(undefined)
// })

// test('with comments', () => {
//   const data = `<div><!-- </div> --></div>`
//   const expected: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'div',
//     startTagOffset: 0,
//     endTagOffset: 20,
//   }
//   expect(findMatchingTags(data, 0)).toEqual(expected)
//   expect(findMatchingTags(data, 10)).toEqual(undefined)
//   expect(findMatchingTags(data, 20)).toEqual(expected)
// })

// test('unfinished opening tags', () => {
//   const data = '<a</a>'
//   const expected: MatchingTagResult = {
//     type: 'onlyStartTag',
//     tagName: 'a<',
//     startTagOffset: 0,
//   }
//   expect(findMatchingTags(data, 0)).toEqual(expected)
//   expect(findMatchingTags(data, 1)).toEqual(expected)
//   expect(findMatchingTags(data, 2)).toEqual(undefined)
//   expect(findMatchingTags(data, 3)).toEqual(undefined)
//   expect(findMatchingTags(data, 4)).toEqual(undefined)
//   expect(findMatchingTags(data, 5)).toEqual(undefined)
//   expect(findMatchingTags(data, 6)).toEqual(undefined)
// })

// test.skip('empty tags', () => {
//   // TODO stackoverflow error
//   const data = '<></>'
//   const expected: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: '',
//     startTagOffset: 0,
//     endTagOffset: 2,
//   }
//   expect(findMatchingTags(data, 0)).toEqual(expected)
//   expect(findMatchingTags(data, 1)).toEqual(expected)
//   expect(findMatchingTags(data, 2)).toEqual(expected)
//   expect(findMatchingTags(data, 3)).toEqual(expected)
//   expect(findMatchingTags(data, 4)).toEqual(expected)
//   expect(findMatchingTags(data, 5)).toEqual(expected)
// })

// test('bug 1', () => {
//   const data = `<body >
//     <div >  </div>
//   </body>`
//   const expectedBody: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'body',
//     startTagOffset: 0,
//     endTagOffset: 29,
//   }
//   const expectedDiv: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'div',
//     startTagOffset: 12,
//     endTagOffset: 20,
//   }
//   expect(findMatchingTags(data, 0)).toEqual(expectedBody) // '<'
//   expect(findMatchingTags(data, 1)).toEqual(expectedBody) // 'b'
//   expect(findMatchingTags(data, 2)).toEqual(expectedBody) // 'o'
//   expect(findMatchingTags(data, 3)).toEqual(expectedBody) // 'd'
//   expect(findMatchingTags(data, 4)).toEqual(expectedBody) // 'y'
//   expect(findMatchingTags(data, 5)).toEqual(expectedBody) // ' '
//   expect(findMatchingTags(data, 6)).toEqual(expectedBody) // '>'
//   expect(findMatchingTags(data, 7)).toEqual(undefined) // '\n'
//   expect(findMatchingTags(data, 8)).toEqual(undefined) // ' '
//   expect(findMatchingTags(data, 9)).toEqual(undefined) // ' '
//   expect(findMatchingTags(data, 10)).toEqual(undefined) // ' '
//   expect(findMatchingTags(data, 11)).toEqual(undefined) // ' '
//   expect(findMatchingTags(data, 12)).toEqual(expectedDiv) // '<'
//   expect(findMatchingTags(data, 13)).toEqual(expectedDiv) // 'd'
//   expect(findMatchingTags(data, 14)).toEqual(expectedDiv) // 'i'
//   expect(findMatchingTags(data, 15)).toEqual(expectedDiv) // 'v'
//   expect(findMatchingTags(data, 16)).toEqual(expectedDiv) // ' '
//   expect(findMatchingTags(data, 17)).toEqual(expectedDiv) // '>'
//   expect(findMatchingTags(data, 18)).toEqual(undefined) // ' '
//   expect(findMatchingTags(data, 19)).toEqual(undefined) // ' '
//   expect(findMatchingTags(data, 20)).toEqual(expectedDiv) // '<'
//   expect(findMatchingTags(data, 21)).toEqual(expectedDiv) // '/'
//   expect(findMatchingTags(data, 22)).toEqual(expectedDiv) // 'd'
//   expect(findMatchingTags(data, 23)).toEqual(expectedDiv) // 'i'
//   expect(findMatchingTags(data, 24)).toEqual(expectedDiv) // 'v'
//   expect(findMatchingTags(data, 25)).toEqual(expectedDiv) // '>'
//   expect(findMatchingTags(data, 26)).toEqual(undefined) // '\n'
//   expect(findMatchingTags(data, 27)).toEqual(undefined) // ' '
//   expect(findMatchingTags(data, 28)).toEqual(undefined) // ' '
//   expect(findMatchingTags(data, 29)).toEqual(expectedBody) // '<'
//   expect(findMatchingTags(data, 30)).toEqual(expectedBody) // '/'
//   expect(findMatchingTags(data, 31)).toEqual(expectedBody) // 'b'
//   expect(findMatchingTags(data, 32)).toEqual(expectedBody) // 'o'
//   expect(findMatchingTags(data, 33)).toEqual(expectedBody) // 'd'
//   expect(findMatchingTags(data, 34)).toEqual(expectedBody) // 'y'
//   expect(findMatchingTags(data, 35)).toEqual(expectedBody) // '>'
//   expect(findMatchingTags(data, 36)).toEqual(undefined) // ''
// })

// test('bug 2', () => {
//   const text = `<h1>
//          hello world
//          <!-- <h1 -->
//        </h1>`
//   const expectedH1: MatchingTagResult = {
//     tagName: 'h1',
//     startTagOffset: 0,
//     endTagOffset: 55,
//     type: 'startAndEndTag',
//   }
//   const expectedH1InsideComment: MatchingTagResult = {
//     tagName: 'h1',
//     startTagOffset: 40,
//     type: 'onlyStartTag',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 3,
//       result: expectedH1,
//     },
//     {
//       start: 4,
//       end: 39,
//       result: undefined,
//     },
//     {
//       start: 40,
//       end: 43,
//       result: expectedH1InsideComment,
//     },
//     {
//       start: 44,
//       end: 54,
//       result: undefined,
//     },
//     {
//       start: 55,
//       end: 59,
//       result: expectedH1,
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('bug 3', () => {
//   const text = '<!-- -->'
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('deep nested tags', () => {
//   const data =
//     '<a><span><ins>hello</ins><img src="./something.png" alt="" /><del>world</del></span></a>'
//   const expectedA: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'a',
//     startTagOffset: 0,
//     endTagOffset: 84,
//   }
//   const expectedSpan: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'span',
//     startTagOffset: 3,
//     endTagOffset: 77,
//   }
//   const expectedIns: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'ins',
//     startTagOffset: 9,
//     endTagOffset: 19,
//   }
//   const expectedImg: MatchingTagResult = {
//     type: 'onlyStartTag',
//     tagName: 'img',
//     startTagOffset: 25,
//   }
//   const expectedDel: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'del',
//     startTagOffset: 61,
//     endTagOffset: 71,
//   }
//   expect(findMatchingTags(data, 0)).toEqual(expectedA) // '<'
//   expect(findMatchingTags(data, 1)).toEqual(expectedA) // 'a'
//   expect(findMatchingTags(data, 2)).toEqual(expectedA) // '>'
//   expect(findMatchingTags(data, 3)).toEqual(expectedSpan) // '<'
//   expect(findMatchingTags(data, 4)).toEqual(expectedSpan) // 's'
//   expect(findMatchingTags(data, 5)).toEqual(expectedSpan) // 'p'
//   expect(findMatchingTags(data, 6)).toEqual(expectedSpan) // 'a'
//   expect(findMatchingTags(data, 7)).toEqual(expectedSpan) // 'n'
//   expect(findMatchingTags(data, 8)).toEqual(expectedSpan) // '>'
//   expect(findMatchingTags(data, 9)).toEqual(expectedIns) // '<'
//   expect(findMatchingTags(data, 10)).toEqual(expectedIns) // 'i'
//   expect(findMatchingTags(data, 11)).toEqual(expectedIns) // 'n'
//   expect(findMatchingTags(data, 12)).toEqual(expectedIns) // 's'
//   expect(findMatchingTags(data, 13)).toEqual(expectedIns) // '>'
//   expect(findMatchingTags(data, 14)).toEqual(undefined) // 'h'
//   expect(findMatchingTags(data, 15)).toEqual(undefined) // 'e'
//   expect(findMatchingTags(data, 16)).toEqual(undefined) // 'l'
//   expect(findMatchingTags(data, 17)).toEqual(undefined) // 'l'
//   expect(findMatchingTags(data, 18)).toEqual(undefined) // 'o'
//   expect(findMatchingTags(data, 19)).toEqual(expectedIns) // '<'
//   expect(findMatchingTags(data, 20)).toEqual(expectedIns) // '/'
//   expect(findMatchingTags(data, 21)).toEqual(expectedIns) // 'i'
//   expect(findMatchingTags(data, 22)).toEqual(expectedIns) // 'n'
//   expect(findMatchingTags(data, 23)).toEqual(expectedIns) // 's'
//   expect(findMatchingTags(data, 24)).toEqual(expectedIns) // '>'
//   expect(findMatchingTags(data, 25)).toEqual(expectedImg) // '<'
//   expect(findMatchingTags(data, 26)).toEqual(expectedImg) // 'i'
//   expect(findMatchingTags(data, 27)).toEqual(expectedImg) // 'm'
//   expect(findMatchingTags(data, 28)).toEqual(expectedImg) // 'g'
//   expect(findMatchingTags(data, 29)).toEqual(expectedImg) // ' '
//   expect(findMatchingTags(data, 30)).toEqual(expectedImg) // 's'
//   expect(findMatchingTags(data, 31)).toEqual(expectedImg) // 'r'
//   expect(findMatchingTags(data, 32)).toEqual(expectedImg) // 'c'
//   expect(findMatchingTags(data, 33)).toEqual(expectedImg) // '='
//   expect(findMatchingTags(data, 34)).toEqual(expectedImg) // '"'
//   expect(findMatchingTags(data, 35)).toEqual(expectedImg) // '.'
//   expect(findMatchingTags(data, 36)).toEqual(expectedImg) // '/'
//   expect(findMatchingTags(data, 37)).toEqual(expectedImg) // 's'
//   expect(findMatchingTags(data, 38)).toEqual(expectedImg) // 'o'
//   expect(findMatchingTags(data, 39)).toEqual(expectedImg) // 'm'
//   expect(findMatchingTags(data, 40)).toEqual(expectedImg) // 'e'
//   expect(findMatchingTags(data, 41)).toEqual(expectedImg) // 't'
//   expect(findMatchingTags(data, 42)).toEqual(expectedImg) // 'h'
//   expect(findMatchingTags(data, 43)).toEqual(expectedImg) // 'i'
//   expect(findMatchingTags(data, 44)).toEqual(expectedImg) // 'n'
//   expect(findMatchingTags(data, 45)).toEqual(expectedImg) // 'g'
//   expect(findMatchingTags(data, 46)).toEqual(expectedImg) // '.'
//   expect(findMatchingTags(data, 47)).toEqual(expectedImg) // 'p'
//   expect(findMatchingTags(data, 48)).toEqual(expectedImg) // 'n'
//   expect(findMatchingTags(data, 49)).toEqual(expectedImg) // 'g'
//   expect(findMatchingTags(data, 50)).toEqual(expectedImg) // '"'
//   expect(findMatchingTags(data, 51)).toEqual(expectedImg) // ' '
//   expect(findMatchingTags(data, 52)).toEqual(expectedImg) // 'a'
//   expect(findMatchingTags(data, 53)).toEqual(expectedImg) // 'l'
//   expect(findMatchingTags(data, 54)).toEqual(expectedImg) // 't'
//   expect(findMatchingTags(data, 55)).toEqual(expectedImg) // '='
//   expect(findMatchingTags(data, 56)).toEqual(expectedImg) // '"'
//   expect(findMatchingTags(data, 57)).toEqual(expectedImg) // '"'
//   expect(findMatchingTags(data, 58)).toEqual(expectedImg) // ' '
//   expect(findMatchingTags(data, 59)).toEqual(expectedImg) // '/'
//   expect(findMatchingTags(data, 60)).toEqual(expectedImg) // '>'
//   expect(findMatchingTags(data, 61)).toEqual(expectedDel) // '<'
//   expect(findMatchingTags(data, 62)).toEqual(expectedDel) // 'd'
//   expect(findMatchingTags(data, 63)).toEqual(expectedDel) // 'e'
//   expect(findMatchingTags(data, 64)).toEqual(expectedDel) // 'l'
//   expect(findMatchingTags(data, 65)).toEqual(expectedDel) // '>'
//   expect(findMatchingTags(data, 66)).toEqual(undefined) // 'w'
//   expect(findMatchingTags(data, 67)).toEqual(undefined) // 'o'
//   expect(findMatchingTags(data, 68)).toEqual(undefined) // 'r'
//   expect(findMatchingTags(data, 69)).toEqual(undefined) // 'l'
//   expect(findMatchingTags(data, 70)).toEqual(undefined) // 'd'
//   expect(findMatchingTags(data, 71)).toEqual(expectedDel) // '<'
//   expect(findMatchingTags(data, 72)).toEqual(expectedDel) // '/'
//   expect(findMatchingTags(data, 73)).toEqual(expectedDel) // 'd'
//   expect(findMatchingTags(data, 74)).toEqual(expectedDel) // 'e'
//   expect(findMatchingTags(data, 75)).toEqual(expectedDel) // 'l'
//   expect(findMatchingTags(data, 76)).toEqual(expectedDel) // '>'
//   expect(findMatchingTags(data, 77)).toEqual(expectedSpan) // '<'
//   expect(findMatchingTags(data, 78)).toEqual(expectedSpan) // '/'
//   expect(findMatchingTags(data, 79)).toEqual(expectedSpan) // 's'
//   expect(findMatchingTags(data, 80)).toEqual(expectedSpan) // 'p'
//   expect(findMatchingTags(data, 81)).toEqual(expectedSpan) // 'a'
//   expect(findMatchingTags(data, 82)).toEqual(expectedSpan) // 'n'
//   expect(findMatchingTags(data, 83)).toEqual(expectedSpan) // '>'
//   expect(findMatchingTags(data, 84)).toEqual(expectedA) // '<'
//   expect(findMatchingTags(data, 85)).toEqual(expectedA) // '/'
//   expect(findMatchingTags(data, 86)).toEqual(expectedA) // 'a'
//   expect(findMatchingTags(data, 87)).toEqual(expectedA) // '>'
//   expect(findMatchingTags(data, 88)).toEqual(undefined) // ''
// })

// test.skip('can match tag from content', () => {
//   const data = '<a>a</a>'
//   const expected = {
//     attributeNestingLevel: 0,
//     opening: { name: 'a', start: 0, end: 3 },
//     closing: { name: 'a', start: 4, end: 8 },
//   }
//   expect(findMatchingTags(data, 0)).toEqual(undefined)
//   expect(findMatchingTags(data, 1)).toEqual(expected)
//   expect(findMatchingTags(data, 2)).toEqual(expected)
//   expect(findMatchingTags(data, 3)).toEqual(expected)
//   expect(findMatchingTags(data, 4)).toEqual(expected)
//   expect(findMatchingTags(data, 5)).toEqual(expected)
//   expect(findMatchingTags(data, 6)).toEqual(expected)
//   expect(findMatchingTags(data, 7)).toEqual(expected)
//   expect(findMatchingTags(data, 8)).toEqual(undefined)
// })

// test('matches self closing tag when flag is true', () => {
//   const data = `<div/>`
//   const expected: MatchingTagResult = {
//     type: 'onlyStartTag',
//     tagName: 'div',
//     startTagOffset: 0,
//   }
//   expect(findMatchingTags(data, 0)).toEqual(expected)
//   expect(findMatchingTags(data, 1)).toEqual(expected)
//   expect(findMatchingTags(data, 2)).toEqual(expected)
//   expect(findMatchingTags(data, 3)).toEqual(expected)
//   expect(findMatchingTags(data, 4)).toEqual(expected)
//   expect(findMatchingTags(data, 5)).toEqual(expected)
//   expect(findMatchingTags(data, 6)).toEqual(undefined)
// })

// test('auto rename tag - bug 1', () => {
//   const text = `<View
//   prop1="1"
// >
//   <View />
// </View>`
//   const expectedOuterView: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'View',
//     startTagOffset: 0,
//     endTagOffset: 31,
//   }
//   const expectedInnerView: MatchingTagResult = {
//     type: 'onlyStartTag',
//     tagName: 'View',
//     startTagOffset: 22,
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 18,
//       result: expectedOuterView,
//     },
//     {
//       start: 19,
//       end: 21,
//       result: undefined,
//     },
//     {
//       start: 22,
//       end: 29,
//       result: expectedInnerView,
//     },
//     {
//       start: 30,
//       end: 30,
//       result: undefined,
//     },
//     {
//       start: 31,
//       end: 37,
//       result: expectedOuterView,
//     },
//     {
//       start: 38,
//       end: 38,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('OPTIONAL: multiline string attribute', () => {
//   const text = `<cfset sql = "
//           SELECT	*
//           FROM	SomeTable
//         ">`

//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: text.length - 1,
//       result: {
//         type: 'onlyStartTag',
//         startTagOffset: 0,
//         tagName: 'cfset',
//       },
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('string attribute with escapes inside', () => {
//   const text =
//     '<cffile action="read" file="\\"#directory#\\"\\#fileName#" variable="localFile">'
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: text.length - 1,
//       result: {
//         type: 'onlyStartTag',
//         startTagOffset: 0,
//         tagName: 'cffile',
//       },
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('escaped string in attribute', () => {
//   const text = '<div class=\\"myclass\\"></div>'
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: text.length - 1,
//       result: {
//         tagName: 'div',
//         type: 'startAndEndTag',
//         startTagOffset: 0,
//         endTagOffset: 23,
//       },
//     },
//     { start: text.length, end: text.length, result: undefined },
//   ]
//   expectRegions(text, regions)
// })

// test.skip('OPTIONAL: inverse matching', () => {
//   const text = `<?
//         $.each(data, function(i, v) {
//           lista += '<tr><td class="text-center">' + v.idconfig +
//               '</td><td>' + v.titulo + '</td><td class="text-center">' +
//               <input class="form-check-input" type="checkbox" disabled ' + (v.ativo == 1 ? 'checked' : '')  +
//               '></td><td class="text-center">' +
//               '<button class="btedit btn btn-link btn-sm" data-id="' + v.idconfig + '">' +
//               '<i class="fas fa-edit"></i></button></td></tr>'
//         });
//         $('#tableconfigs tbody').html(lista);
//       `.trim()

//   const expectedTr1: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'tr',
//     startTagOffset: 61,
//     endTagOffset: 90,
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 60,
//       result: undefined,
//     },
//     {
//       start: 61,
//       end: 70,
//       result: expectedTr1,
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('function call as an attribute value', () => {
//   const text = '<cfset someFileHash = hash(someFile, "SHA-512")>content</cfset>'
//   const expectedCfset: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'cfset',
//     startTagOffset: 0,
//     endTagOffset: 55,
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 47,
//       result: expectedCfset,
//     },
//     {
//       start: 48,
//       end: 54,
//       result: undefined,
//     },
//     {
//       start: 55,
//       end: text.length - 1,
//       result: expectedCfset,
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('vue-js special syntax', () => {
//   const text = '<element-tag @attr="f(x)" :special=special></element-tag>'
//   const expectedElementTag: MatchingTagResult = {
//     type: 'startAndEndTag',
//     startTagOffset: 0,
//     endTagOffset: 43,
//     tagName: 'element-tag',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: text.length - 1,
//       result: expectedElementTag,
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('xml namespaces', () => {
//   const text = '<ns:element></ns:element>'
//   const expectedNsElement: MatchingTagResult = {
//     startTagOffset: 0,
//     endTagOffset: 12,
//     tagName: 'ns:element',
//     type: 'startAndEndTag',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: text.length - 1,
//       result: expectedNsElement,
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test('dot separated tag name', () => {
//   const text = '<ns.element></ns.element>'
//   const expectedNsElement: MatchingTagResult = {
//     startTagOffset: 0,
//     endTagOffset: 12,
//     tagName: 'ns.element',
//     type: 'startAndEndTag',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: text.length - 1,
//       result: expectedNsElement,
//     },
//     {
//       start: text.length,
//       end: text.length,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test.skip('challenging jsx syntax', () => {
//   const text = `<Carousel
//             x={isMobile ? 3>6 : 4<7}
//             prevArrow={<div>{2<9}</div>}
//             nextArrow={<div>{'>'}</div>}
//           >
//           </Carousel>`
//   const expectedCarousel: MatchingTagResult = {
//     type: 'startAndEndTag',
//     startTagOffset: 0,
//     endTagOffset: 81,
//     tagName: 'Carousel',
//   }
//   const expectedDiv1: MatchingTagResult = {
//     type: 'startAndEndTag',
//     startTagOffset: 0,
//     endTagOffset: 81,
//     tagName: 'div',
//   }
//   const expectedDiv2: MatchingTagResult = {
//     type: 'startAndEndTag',
//     startTagOffset: 0,
//     endTagOffset: 81,
//     tagName: 'div',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 21,
//       result: expectedCarousel,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test.skip('function as an attribute without block', () => {
//   // TODO comment bug
//   const text = `<cfset testArr = ['Hello', 'Hi', 'Howdy', ''] />
//           <cfif ArrayLen(testArr) GT 2>
//             <!--- do something --->
//           </cfif>`
//   const expectedCfset: MatchingTagResult = {
//     type: 'onlyStartTag',
//     tagName: 'cfset',
//     startTagOffset: 0,
//   }
//   const expectedCfif: MatchingTagResult = {
//     type: 'startAndEndTag',
//     startTagOffset: 59,
//     endTagOffset: 135,
//     tagName: 'cfif',
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 47,
//       result: expectedCfset,
//     },
//     {
//       start: 48,
//       end: 58,
//       result: undefined,
//     },
//     {
//       start: 59,
//       end: 87,
//       result: expectedCfif,
//     },
//     {
//       start: 88,
//       end: 102,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test.skip('angular syntax', () => {
//   // TODO comment bug
//   const text = `<div> <!-- cant find -->
//           <div> <!-- cant find -->
//             <div class="some-class" *ngFor="let bar of bars"> <!-- cant find -->
//               <div class="foo"> <!--works!-->
//                 <p>Hello</p> <!--works-->
//               </div>
//               <div class="bar"><!--works!-->
//                 <p>Hello</p> <!--works-->
//               </div>
//             </div>
//           </div>
//         </div>`
//   const expectedDiv1: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'div',
//     startTagOffset: 0,
//     endTagOffset: 402,
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 4,
//       result: expectedDiv1,
//     },
//     {
//       start: 5,
//       end: 21,
//       result: undefined,
//     },
//   ]
//   expectRegions(text, regions)
// })

// test.skip('php syntax + bad formatting', () => {
//   const text = `<div class = 'bg-warning' >
//             <?php displayErrors($errors); ?>
//           </div>`

//   const expectedDiv: MatchingTagResult = {
//     type: 'startAndEndTag',
//     tagName: 'div',
//     startTagOffset: 0,
//     endTagOffset: 63,
//   }
//   const regions: MatchingTagRegion[] = [
//     {
//       start: 0,
//       end: 33,
//       result: expectedDiv,
//     },
//   ]
//   expectRegions(text, regions)
// })
// // TODO test compound react tags, e.g. <Toggle.On> <Toggle.Off>

// // TODO test different languages, e.g. german, greek, chinese
