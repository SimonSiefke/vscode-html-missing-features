// TODO
/**
 * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
 * are located before all elements where p(x) is true.
 *
 * @returns The least x for which p(x) is true or array.length if no element fullfills the given function.
 */
export function findFirst<T>(array: T[], p: (x: T) => boolean): number {
  let low = 0
  let high = array.length
  if (high === 0) {
    return 0 // no children
  }
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (p(array[mid])) {
      high = mid
    } else {
      low = mid + 1
    }
  }
  return low
}

// function pretty(node: Node): void {}
// function isSameTag(
//   firstTag: string | undefined,
//   secondTag: string | undefined
// ): boolean {
//   return (
//     firstTag && firstTag.length === secondTag.length && firstTag === secondTag
//   )
// }

// function findNodeBeforeOffset(node: Node, offset: number): Node {
//   const idx = findFirst(node.children, c => offset <= c.start) - 1
//   if (idx >= 0) {
//     const child = node.children[idx]
//     if (offset > child.start) {
//       if (offset < child.end) {
//         return child.findNodeBefore(offset)
//       }
//       const { lastChild } = child
//       if (lastChild && lastChild.end === child.end) {
//         return child.findNodeBefore(offset)
//       }
//       return child
//     }
//   }
//   return node
// }

// function findNodeAtOffset(node: Node, offset: number): Node {
//   const idx = findFirst(node.children, c => offset <= c.start) - 1
//   if (idx >= 0) {
//     const child = node.children[idx]
//     if (offset > child.start && offset <= child.end) {
//       return child.findNodeAt(offset)
//     }
//   }
//   return node
// }

export class Node {
  public tagName: string | undefined

  public closed: boolean = false

  public start: number

  public end: number

  public children: Node[]

  public parent?: Node

  public startTagEnd: number | undefined

  public endTagStart: number | undefined

  public attributes: { [name: string]: string | undefined } = {}

  constructor(start: number, end: number, children: Node[], parent?: Node) {
    this.start = start
    this.end = end
    this.children = children
    this.parent = parent
  }

  public get attributeNames(): string[] {
    return this.attributes ? Object.keys(this.attributes) : []
  }

  public isSameTag(tagInLowerCase: string): boolean {
    return (
      this.tagName &&
      tagInLowerCase &&
      this.tagName.length === tagInLowerCase.length &&
      this.tagName.toLowerCase() === tagInLowerCase
    )
  }

  public get firstChild(): Node | undefined {
    return this.children[0]
  }

  public get lastChild(): Node | undefined {
    return this.children[this.children.length - 1]
  }

  public findNodeBefore(offset: number): Node {
    const idx = findFirst(this.children, c => offset <= c.start) - 1
    if (idx >= 0) {
      const child = this.children[idx]
      if (offset > child.start) {
        if (offset < child.end) {
          return child.findNodeBefore(offset)
        }
        const { lastChild } = child
        if (lastChild && lastChild.end === child.end) {
          return child.findNodeBefore(offset)
        }
        return child
      }
    }
    return this
  }

  public findNodeAt(offset: number): Node {
    const idx = findFirst(this.children, c => offset <= c.start) - 1
    if (idx >= 0) {
      const child = this.children[idx]
      if (offset > child.start && offset <= child.end) {
        return child.findNodeAt(offset)
      }
    }
    return this
  }
}
