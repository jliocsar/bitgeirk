import type { DatabaseEngineOptions, Document } from '~/engine/engine.types'
import { DatabaseEngine } from '~/engine/database-engine'

export type Collection = {
  name: string
  findAll: () => Promise<Document[]>
}

export class Client {
  readonly engine: DatabaseEngine

  constructor(readonly engineOptions?: Partial<DatabaseEngineOptions>) {
    this.engine = new DatabaseEngine(engineOptions)
  }

  async getCollection(collectionName: string) {
    const collection: Collection = {
      name: collectionName,
      findAll: this.engine.read.bind(this.engine, collectionName),
    }

    return collection
  }
}
