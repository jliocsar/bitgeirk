import type { BinaryTableConfiguration } from './binary-table.types'
import { BinaryFileManager } from './binary-file-manager'

const defaultTableManagerConfiguration: BinaryTableConfiguration = {
  filePath: 'test',
}

export class BinaryTableManager<
  SchemaType,
> extends BinaryFileManager<SchemaType> {
  readonly configuration: BinaryTableConfiguration

  constructor(
    configuration: BinaryTableConfiguration = defaultTableManagerConfiguration,
  ) {
    const binaryTableConfiguration = {
      ...defaultTableManagerConfiguration,
      ...configuration,
    }
    super(binaryTableConfiguration.filePath)
    this.configuration = binaryTableConfiguration
  }

  readRows() {
    return this.readFile()
  }

  async appendRows(rows: SchemaType | SchemaType[]) {
    const appendableRows = Array.isArray(rows) ? rows : [rows]
    return this.writeToFile(appendableRows)
  }
}
