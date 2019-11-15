import { createScanner, TokenType } from '../htmlScanner/htmlScanner'
import { Node } from './Node'

// function parse2(text:string, isSelfClosingTag:any):any{

// }

// parse2('<h1></h1>')

interface Tree extends Partial<Node> {
  roots: any
}
export function parse(
  text: string,
  selfClosingTags: string[] = [
    '!DOCTYPE',
    '!doctype',
    'input',
    'br',
    'base',
    'link',
    'hr',
    'img',
    'meta',
  ]
): Tree {
  const scanner = createScanner(text)
  const htmlDocument = new Node(0, text.length, [], undefined)
  let curr = htmlDocument
  let endTagStart = -1
  let endTagName: string | null = null
  let pendingAttribute: string | null = null
  let token = scanner.scan()
  while (token !== TokenType.EOS) {
    switch (token) {
      case TokenType.StartTagOpen:
        const child = new Node(scanner.getTokenOffset(), text.length, [], curr)
        curr.children.push(child)
        curr = child
        break
      case TokenType.StartTag:
        curr.tagName = scanner.getTokenText()
        break
      case TokenType.StartTagClose:
        curr.end = scanner.getTokenEnd() // might be later set to end tag position
        curr.startTagEnd = scanner.getTokenEnd()
        if (
          curr.tagName &&
          selfClosingTags.includes(curr.tagName) &&
          curr.parent
        ) {
          curr.closed = true
          curr = curr.parent
        }
        break
      case TokenType.StartTagSelfClose:
        if (curr.parent) {
          curr.closed = true
          curr.end = scanner.getTokenEnd()
          curr.startTagEnd = scanner.getTokenEnd()
          curr = curr.parent
        }
        break
      case TokenType.EndTagOpen:
        endTagStart = scanner.getTokenOffset()
        endTagName = undefined
        break
      case TokenType.EndTag:
        endTagName = scanner.getTokenText().toLowerCase()
        break
      case TokenType.EndTagClose:
        if (endTagName) {
          let node = curr
          // see if we can find a matching tag
          while (!node.isSameTag(endTagName) && node.parent) {
            node = node.parent
          }
          if (node.parent) {
            while (curr !== node) {
              curr.end = endTagStart
              curr.closed = false
              curr = curr.parent
            }
            curr.closed = true
            curr.endTagStart = endTagStart
            curr.end = scanner.getTokenEnd()
            curr = curr.parent
          }
        }
        break
      case TokenType.AttributeName: {
        pendingAttribute = scanner.getTokenText()
        let { attributes } = curr
        if (!attributes) {
          curr.attributes = {}
          attributes = {}
        }
        attributes[pendingAttribute] = undefined // Support valueless attributes such as 'checked'
        break
      }
      case TokenType.AttributeValue: {
        const value = scanner.getTokenText()
        const { attributes } = curr
        if (attributes && pendingAttribute) {
          attributes[pendingAttribute] = value
          pendingAttribute = undefined
        }
        break
      }
    }
    token = scanner.scan()
  }
  while (curr.parent) {
    curr.end = text.length
    curr.closed = false
    curr = curr.parent
  }
  return {
    roots: htmlDocument.children,
    findNodeBefore: htmlDocument.findNodeBefore.bind(htmlDocument),
    findNodeAt: htmlDocument.findNodeAt.bind(htmlDocument),
  }
}

// function toJSONWithAttributes(node: Node): any {
//   return {
//     tag: node.tagName,
//     children: node.children.map(toJSONWithAttributes),
//   }
// }

// const r = parse('<h1><p>ok</p></h1>', () => true).roots[0] // ?
// // '<h1><p>ok</h1>').roots[0] // ?
// toJSONWithAttributes(r) // ?
