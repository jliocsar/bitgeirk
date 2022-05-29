export type Document = {
  id: string
  data: string
}

export type DatabaseEngineOptions = {
  rootPath: string
  defaultDatabaseName: string
  defaultCollectionName: string
}
export type DatabaseEngineConfiguration = Pick<
  DatabaseEngineOptions,
  'rootPath' | 'defaultCollectionName'
> & {
  databaseName: string
  collectionName: string
}
