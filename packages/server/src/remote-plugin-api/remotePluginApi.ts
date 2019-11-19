import { ConnectionProxy } from './connectionProxy/connectionProxy'
import { DocumentsProxy } from './documentsProxy/documentsProxy'

export interface RemotePluginApi {
  readonly connectionProxy: ConnectionProxy
  readonly documentsProxy: DocumentsProxy
}
