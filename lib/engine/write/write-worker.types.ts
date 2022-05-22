import type { Document } from '~/engine/engine.types'

export type WriteDocumentsArgs = {
  writePath: string
  documents: Document[]
}

export type WriteDocumentsFunction = {
  (args: WriteDocumentsArgs): Promise<Document[]>
}
