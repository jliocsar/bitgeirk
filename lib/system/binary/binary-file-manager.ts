import BinaryFile from 'binary-file'

class ParsedFileResult<DataType> {
  constructor(readonly data: string, readonly parsedData: DataType[]) {}
}

export class BinaryFileManager<SchemaType> {
  protected file: BinaryFile

  constructor(filePath: string) {
    this.file = this.getReadAndAppendBinaryFile(filePath)
  }

  async start() {
    await this.file.open()
  }

  async stop() {
    await this.file.close()
  }

  protected async writeToFile(data: SchemaType[]) {
    const { parsedData: parsedPreviousData } = await this.getParsedFileData()
    const updatedData = parsedPreviousData
      ? [...parsedPreviousData, ...data]
      : data
    const updatedDataString = JSON.stringify(updatedData)

    await this.file.writeString(updatedDataString)

    return updatedData
  }

  protected async readFile() {
    const { data, parsedData } = await this.getParsedFileData()

    if (!data) {
      return []
    }

    return parsedData
  }

  private async getParsedFileData() {
    const dataSize = await this.file.readUInt32()
    const data = await this.file.readString(dataSize)
    const parsedData: SchemaType[] = data ? JSON.parse(data) : []
    return new ParsedFileResult(data, parsedData)
  }

  private getReadAndAppendBinaryFile(filePath: string) {
    return new BinaryFile(filePath, 'a+')
  }
}
