import { parse } from './htmlParser'
import { Node } from './Node'

function toJSON(node: Node): any {
  return {
    tag: node.tagName,
    start: node.start,
    end: node.end,
    endTagStart: node.endTagStart,
    closed: node.closed,
    children: node.children.map(toJSON),
  }
}

function toJSONWithAttributes(node: Node): any {
  return {
    tag: node.tagName,
    attributes: node.attributes,
    children: node.children.map(toJSONWithAttributes),
  }
}

function assertDocument(input: string, expected: any): void {
  const document = parse(input)
  expect(document.roots.map(toJSON)).toEqual(expected)
}

function assertNodeBefore(
  input: string,
  offset: number,
  expectedTag: string | undefined
): void {
  const document = parse(input) as any
  const node = document.findNodeBefore(offset)
  expect(node ? node.tagName : '').toBe(expectedTag)
}

function assertAttributes(input: string, expected: any): void {
  const document = parse(input)
  expect(document.roots.map(toJSONWithAttributes)).toEqual(expected)
}

test('Simple', () => {
  assertDocument('<html></html>', [
    {
      tag: 'html',
      start: 0,
      end: 13,
      endTagStart: 6,
      closed: true,
      children: [],
    },
  ])
  assertDocument('<html><body></body></html>', [
    {
      tag: 'html',
      start: 0,
      end: 26,
      endTagStart: 19,
      closed: true,
      children: [
        {
          tag: 'body',
          start: 6,
          end: 19,
          endTagStart: 12,
          closed: true,
          children: [],
        },
      ],
    },
  ])
  assertDocument('<html><head></head><body></body></html>', [
    {
      tag: 'html',
      start: 0,
      end: 39,
      endTagStart: 32,
      closed: true,
      children: [
        {
          tag: 'head',
          start: 6,
          end: 19,
          endTagStart: 12,
          closed: true,
          children: [],
        },
        {
          tag: 'body',
          start: 19,
          end: 32,
          endTagStart: 25,
          closed: true,
          children: [],
        },
      ],
    },
  ])
})

test('SelfClose', () => {
  assertDocument('<br/>', [
    {
      tag: 'br',
      start: 0,
      end: 5,
      endTagStart: undefined,
      closed: true,
      children: [],
    },
  ])
  assertDocument('<div><br/><span></span></div>', [
    {
      tag: 'div',
      start: 0,
      end: 29,
      endTagStart: 23,
      closed: true,
      children: [
        {
          tag: 'br',
          start: 5,
          end: 10,
          endTagStart: undefined,
          closed: true,
          children: [],
        },
        {
          tag: 'span',
          start: 10,
          end: 23,
          endTagStart: 16,
          closed: true,
          children: [],
        },
      ],
    },
  ])
})

test('EmptyTag', () => {
  assertDocument('<meta>', [
    {
      tag: 'meta',
      start: 0,
      end: 6,
      endTagStart: undefined,
      closed: true,
      children: [],
    },
  ])
  assertDocument('<div><input type="button"><span><br><br></span></div>', [
    {
      tag: 'div',
      start: 0,
      end: 53,
      endTagStart: 47,
      closed: true,
      children: [
        {
          tag: 'input',
          start: 5,
          end: 26,
          endTagStart: undefined,
          closed: true,
          children: [],
        },
        {
          tag: 'span',
          start: 26,
          end: 47,
          endTagStart: 40,
          closed: true,
          children: [
            {
              tag: 'br',
              start: 32,
              end: 36,
              endTagStart: undefined,
              closed: true,
              children: [],
            },
            {
              tag: 'br',
              start: 36,
              end: 40,
              endTagStart: undefined,
              closed: true,
              children: [],
            },
          ],
        },
      ],
    },
  ])
})

test('MissingTags', () => {
  assertDocument('</meta>', [])
  assertDocument('<div></div></div>', [
    {
      tag: 'div',
      start: 0,
      end: 11,
      endTagStart: 5,
      closed: true,
      children: [],
    },
  ])
  assertDocument('<div><div></div>', [
    {
      tag: 'div',
      start: 0,
      end: 16,
      endTagStart: undefined,
      closed: false,
      children: [
        {
          tag: 'div',
          start: 5,
          end: 16,
          endTagStart: 10,
          closed: true,
          children: [],
        },
      ],
    },
  ])
  assertDocument('<title><div></title>', [
    {
      tag: 'title',
      start: 0,
      end: 20,
      endTagStart: 12,
      closed: true,
      children: [
        {
          tag: 'div',
          start: 7,
          end: 12,
          endTagStart: undefined,
          closed: false,
          children: [],
        },
      ],
    },
  ])
  assertDocument('<h1><div><span></h1>', [
    {
      tag: 'h1',
      start: 0,
      end: 20,
      endTagStart: 15,
      closed: true,
      children: [
        {
          tag: 'div',
          start: 4,
          end: 15,
          endTagStart: undefined,
          closed: false,
          children: [
            {
              tag: 'span',
              start: 9,
              end: 15,
              endTagStart: undefined,
              closed: false,
              children: [],
            },
          ],
        },
      ],
    },
  ])
})

test('FindNodeBefore', () => {
  const str = '<div><input type="button"><span><br><hr></span></div>'
  assertNodeBefore(str, 0, undefined)
  assertNodeBefore(str, 1, 'div')
  assertNodeBefore(str, 5, 'div')
  assertNodeBefore(str, 6, 'input')
  assertNodeBefore(str, 25, 'input')
  assertNodeBefore(str, 26, 'input')
  assertNodeBefore(str, 27, 'span')
  assertNodeBefore(str, 32, 'span')
  assertNodeBefore(str, 33, 'br')
  assertNodeBefore(str, 36, 'br')
  assertNodeBefore(str, 37, 'hr')
  assertNodeBefore(str, 40, 'hr')
  assertNodeBefore(str, 41, 'hr')
  assertNodeBefore(str, 42, 'hr')
  assertNodeBefore(str, 47, 'span')
  assertNodeBefore(str, 48, 'span')
  assertNodeBefore(str, 52, 'span')
  assertNodeBefore(str, 53, 'div')
})

test('FindNodeBefore - incomplete node', () => {
  const str = '<div><span><br></div>'
  assertNodeBefore(str, 15, 'br')
  assertNodeBefore(str, 18, 'br')
  assertNodeBefore(str, 21, 'div')
})

test('Attributes', () => {
  const str =
    '<div class="these are my-classes" id="test"><span aria-describedby="test"></span></div>'
  assertAttributes(str, [
    {
      tag: 'div',
      attributes: {
        class: '"these are my-classes"',
        id: '"test"',
      },
      children: [
        {
          tag: 'span',
          attributes: {
            'aria-describedby': '"test"',
          },
          children: [],
        },
      ],
    },
  ])
})

test('Attributes without value', () => {
  const str = '<div checked id="test"></div>'
  assertAttributes(str, [
    {
      tag: 'div',
      attributes: {
        checked: undefined,
        id: '"test"',
      },
      children: [],
    },
  ])
})
