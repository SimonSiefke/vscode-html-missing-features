import {
  doAutoCompletionElementRenameTag,
  getMatchingTagPairs,
  isSelfClosingTag as _isSelfClosingTag,
} from 'service'
import { RemotePlugin } from '../remotePlugin'
import { RequestType, TextDocumentIdentifier } from 'vscode-languageserver'

interface Tag {
  readonly word: string
  readonly oldWord: string
  readonly offset: number
}
interface Params {
  readonly textDocument: TextDocumentIdentifier
  readonly tags: Tag[]
}

interface Result {
  readonly startOffset: number
  readonly endOffset: number
  readonly tagName: string
  readonly originalWord: string
  readonly originalOffset: number
}

const requestType = new RequestType<Params, Result[], any, any>(
  'html-missing-features/auto-completion-element-rename-tag'
)

const unique: <T>(items: T[]) => T[] = <T>(items: T[]) => {
  const seen = new Set<string>()
  const result: T[] = []
  for (const item of items) {
    const stringifiedItem = JSON.stringify(item)
    if (!seen.has(stringifiedItem)) {
      seen.add(stringifiedItem)
      result.push(item)
    }
  }
  return result
}

// TODO implement this on client
// const irrelevantChangeRE = /^[<>]$/

// const isRelevantChange: (change: Change) => boolean = change => {
//   return change.rangeLength > 0 || !irrelevantChangeRE.test(change.text)
// }

export const remotePluginAutoCompletionElementRenameTag: RemotePlugin = api => {
  api.connectionProxy.onRequest(requestType, ({ textDocument, tags }) => {
    const document = api.documentsProxy.get(textDocument.uri)
    if (!document) {
      console.log('no document')
      return []
    }
    const text = document.getText()
    /**
     * actual cursor offset depends on the inserted text, e.g.
     * <h1|></h1>
     * <h2|></h2>
     * <h3|></h3>
     * <h4|></h4>
     * <h5|></h5>
     * <h6|></h6>
     * when typing "i" it becomes
     * <h1i></h1>
     * <h2i></h2>
     * <h3i></h3>
     * <h4i></h4>
     * <h5i></h5>
     * <h6i></h6>
     * the rangeOffsets are [3, 13, 23, 33, 43, 53], however because "i" was inserted
     * the actual cursor offsets are now [3, 14, 25, 36, 47, 58]
     *
     */
    // const offsets = []
    // let totalInserted = 0
    // for (const change of relevantChanges) {
    //   offsets.push(totalInserted + change.rangeOffset)
    //   totalInserted += change.text.length - change.rangeLength
    // }
    // // console.log(JSON.stringify(relevantChanges))
    const matchingTagPairs = getMatchingTagPairs(document.languageId)
    const isSelfClosingTag: (tagName: string) => boolean = tagName =>
      _isSelfClosingTag(document.languageId, tagName)
    const results: (Result | undefined)[] = tags.map(tag => {
      const result = doAutoCompletionElementRenameTag(
        text,
        tag.offset,
        tag.word,
        tag.oldWord,
        matchingTagPairs,
        isSelfClosingTag
      )
      if (!result) {
        return result
      }
      ;(result as any).originalOffset = tag.offset
      ;(result as any).originalWord = tag.word
      return result as Result
    })

    const uniqueResults = results.filter(Boolean) as Result[]

    if (uniqueResults.length === 0) {
      console.log(
        JSON.stringify({
          text,
          offset: tags[0].offset,
          word: tags[0].word,
          oldWord: tags[0].oldWord,
          matchingTagPairs,
          isSelfClosingTag,
        })
      )
      console.log(JSON.stringify(results))
    }
    return uniqueResults
  })
}
