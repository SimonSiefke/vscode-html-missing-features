import * as vscode from 'vscode'
import { createLanguageClientProxy } from './local-plugin-api/languageClientProxy/languageClientProxy'
import { LocalPluginApi } from './local-plugin-api/localPluginApi'
import { utils } from './local-plugin-api/utils/utils'
import { createVscodeProxy } from './local-plugin-api/vscodeProxy/vscodeProxy'
import { localPluginAutoCompletionElementAutoClose } from './local-plugins/local-plugin-auto-completion-element-auto-close/localPluginAutoCompletionElementAutoClose'
import { localPluginAutoCompletionElementRenameTag } from './local-plugins/local-plugin-auto-completion-element-rename-tag/localPluginAutoCompletionElementRenameTag'
import { localPluginAutoCompletionElementSelfClosing } from './local-plugins/local-plugin-auto-completion-element-self-closing/localPluginAutoCompletionElementSelfClosing'
import { localPluginAutoCompletionInsertQuotesAfterEqualSign } from './local-plugins/local-plugin-auto-completion-insert-quotes-after-equal-sign/localPluginAutoCompletionInsertQuotesAfterEqualSign'
import { localPluginShowWarningMessageOnLargeFiles } from './local-plugins/local-plugin-show-warning-message-on-large-files/localPluginShowWarningMessageOnLargeFiles'
import { localPluginWrapSelectionWithTag } from './local-plugins/local-plugin-wrap-selection-with-tag/localPluginWrapSelectionWithTag'

export const activate: (
  context: vscode.ExtensionContext
) => Promise<void> = async context => {
  const api: LocalPluginApi = {
    languageClientProxy: await createLanguageClientProxy(context),
    vscodeProxy: createVscodeProxy(context),
    utils,
  }
  localPluginAutoCompletionElementRenameTag(api)
  localPluginAutoCompletionElementAutoClose(api)
  localPluginAutoCompletionElementSelfClosing(api)
  localPluginAutoCompletionInsertQuotesAfterEqualSign(api)
  localPluginWrapSelectionWithTag(api)
  // localPluginHighlightElementMatchingTag(api)

  localPluginShowWarningMessageOnLargeFiles(api)

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    import('./autoreload')
  }
}
