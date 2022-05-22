import path from 'node:path'
import fs from 'node:fs/promises'

import Piscina from 'piscina'
import { nanoid } from 'nanoid'

import { pathExists } from '~/system'
import { BinaryTableManager } from '~/system/binary'

import type {
  DatabaseEngineConfiguration,
  DatabaseEngineOptions,
  Document,
} from './engine.types'
import type { DatabaseSchema } from './database-schema'
import { WriteDocumentsArgs } from './write'

const defaultDatabaseEngineOptions: DatabaseEngineOptions = {
  defaultDatabaseName: 'db',
  defaultCollectionName: 'test',
  defaultIdSize: 20,
}

export class DatabaseEngine {
  readonly configuration: DatabaseEngineConfiguration
  readonly pool = new Piscina({
    filename: path.resolve(__dirname, './write/write-worker.ts'),
    maxQueue: 'auto',
  })

  constructor(
    readonly options: Partial<DatabaseEngineOptions> = defaultDatabaseEngineOptions,
  ) {
    const engineOptions = {
      ...defaultDatabaseEngineOptions,
      ...options,
    }
    this.configuration = {
      databaseName: engineOptions.defaultDatabaseName,
      idSize: engineOptions.defaultIdSize,
    }
  }

  async read(
    collectionName = this.options.defaultCollectionName,
  ): Promise<Document[]> {
    if (!collectionName) {
      throw new Error('A `collectionName` is required')
    }

    const readPath = await this.getCollectionPath(collectionName)
    const binaryTableManager = new BinaryTableManager<DatabaseSchema>({
      filePath: readPath,
    })

    // TODO: Pass this work to a piscina too
    const readResult = await binaryTableManager.readRows()

    return readResult
  }

  async write<DataType>(
    data: DataType | DataType[],
    collectionName = this.options.defaultCollectionName,
  ): Promise<Document[]> {
    if (!collectionName) {
      throw new Error('A `collectionName` is required')
    }

    const dataList = Array.isArray(data) ? data : [data]
    // TODO: Validate `writeData` types before stringifying it
    const documents: Document[] = dataList.map(writeData => ({
      id: nanoid(this.configuration.idSize),
      data: JSON.stringify(writeData),
    }))

    const writePath = await this.getCollectionPath(collectionName)
    const writeTaskArgs: WriteDocumentsArgs = {
      documents,
      writePath,
    }
    const writeResult: Document[] = await this.pool.run(writeTaskArgs)

    return writeResult
  }

  private async getOrCreateDatabasePath() {
    const databasePathExists = await pathExists(this.configuration.databaseName)

    if (!databasePathExists) {
      await fs.mkdir(this.configuration.databaseName, {
        recursive: true,
      })
    }

    return this.configuration.databaseName
  }

  private async getCollectionPath(
    collectionName = this.options.defaultCollectionName,
  ) {
    if (!collectionName) {
      throw new Error('A `collectionName` is required')
    }

    const databasePath = await this.getOrCreateDatabasePath()

    return path.resolve(databasePath, `${collectionName}.bin`)
  }
}
