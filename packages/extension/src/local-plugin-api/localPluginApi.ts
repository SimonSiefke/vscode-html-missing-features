import { LanguageClientProxy } from './languageClientProxy/languageClientProxy'
import { VscodeProxy } from './vscodeProxy/vscodeProxy'
import { Utils } from './utils/utils'

export type LocalPluginApi = {
  readonly vscodeProxy: VscodeProxy
  readonly languageClientProxy: LanguageClientProxy
  readonly utils: Utils
}
