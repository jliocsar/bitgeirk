export type Document = {
  id: string
  data: string
}

export type DatabaseEngineOptions = {
  defaultDatabaseName: string
  defaultCollectionName: string
  defaultIdSize: number
}

export type DatabaseEngineConfiguration = {
  databaseName: string
  idSize: number
}
