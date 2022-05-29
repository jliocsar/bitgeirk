import path from 'node:path'

import { BinaryFileManager } from '~/system/binary-file-manager'

import type {
  DatabaseEngineConfiguration,
  DatabaseEngineOptions,
  Document,
} from './database-engine.types'

const defaultDatabaseEngineOptions: DatabaseEngineOptions = {
  rootPath: path.resolve(__dirname, '../..', 'db'),
  defaultCollectionName: 'collecto',
  defaultDatabaseName: 'databaso',
}

export class Collection {
  constructor(
    readonly name: string,
    private readonly binaryFileManager: BinaryFileManager<Document>,
  ) {}

  async create(documentOrDocuments: Document | Document[]) {
    const documents = Array.isArray(documentOrDocuments)
      ? documentOrDocuments
      : [documentOrDocuments]

    return this.binaryFileManager.writeToFile(documents)
  }

  async findAll(): Promise<string[]> {
    try {
      const { data } = await this.binaryFileManager.readFile()
      return data
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

export class DatabaseEngine {
  private binaryFileManager: BinaryFileManager<Document> | null = null
  private lastCollection: string
  readonly configuration: DatabaseEngineConfiguration

  constructor(options: DatabaseEngineOptions) {
    const engineOptions = {
      ...defaultDatabaseEngineOptions,
      ...options,
    }
    this.configuration = {
      databaseName: engineOptions.defaultDatabaseName,
      collectionName: engineOptions.defaultCollectionName,
      defaultCollectionName: engineOptions.defaultCollectionName,
      rootPath: engineOptions.rootPath,
    }
    this.lastCollection = this.configuration.collectionName
  }

  get databasePath() {
    return path.resolve(
      this.configuration.rootPath,
      this.configuration.databaseName,
    )
  }

  async start() {
    this.binaryFileManager = this.createBinaryFileManager(
      this.configuration.defaultCollectionName,
    )
    await this.createDatabase()
    await this.binaryFileManager.start()
  }

  async stop() {
    await this.binaryFileManager?.stop()
  }

  async switchDatabase(databaseName: string, newCollectionName?: string) {
    this.configuration.databaseName = databaseName
    // Resets the `binaryFileManager` since it's based on the `databasePath` too
    await this.resetBinaryFileManager(newCollectionName)
  }

  async collection(collectionName: string) {
    if (!this.binaryFileManager) {
      throw new Error(
        "'binaryFileManager' is not initialized, did you forget to call 'start()'?",
      )
    }

    if (this.lastCollection !== collectionName) {
      await this.resetBinaryFileManager(collectionName)
    }

    return new Collection(collectionName, this.binaryFileManager)
  }

  private async createDatabase() {
    this.binaryFileManager?.createWriteFolder(this.databasePath)
  }

  private async resetBinaryFileManager(collectionName?: string) {
    await this.binaryFileManager?.stop()
    this.binaryFileManager = this.createBinaryFileManager(
      collectionName ?? this.configuration.defaultCollectionName,
    )
    await this.binaryFileManager.start()
  }

  private createBinaryFileManager(collectionName: string) {
    return new BinaryFileManager<Document>(
      this.getCollectionPath(collectionName),
    )
  }

  private getCollectionPath(collectionName: string) {
    return path.resolve(this.databasePath, collectionName)
  }
}
