import { ConnectionProxy } from './connectionProxy/connectionProxy'
import { DocumentsProxy } from './documentsProxy/documentsProxy'
import { Utils } from './utils/utils'

export interface RemotePluginApi {
  readonly connectionProxy: ConnectionProxy
  readonly documentsProxy: DocumentsProxy
  readonly utils: Utils
}
