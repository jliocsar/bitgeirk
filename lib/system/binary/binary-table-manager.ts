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
    super()
    this.configuration = {
      ...defaultTableManagerConfiguration,
      ...configuration,
    }
  }

  async readRows() {
    const rows = await this.readFile(this.configuration.filePath)
    const parsedRows: SchemaType[] = rows.map(row => ({
      ...row,
    }))

    return parsedRows
  }

  async appendRows(rows: SchemaType | SchemaType[]) {
    const currentRows = await this.readRows()
    const newRows = Array.isArray(rows) ? rows : [rows]
    const updatedRows = [...currentRows, ...newRows]
    await this.writeFile(this.configuration.filePath, updatedRows)
    return updatedRows
  }
}
