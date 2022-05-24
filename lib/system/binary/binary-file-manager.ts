import BinaryFile from 'binary-file'

class ParsedFileResult<DataType> {
  constructor(readonly data: string, readonly parsedData: DataType[]) {}
}

export class BinaryFileManager<SchemaType> {
  protected async writeFile(filePath: string, data: SchemaType[]) {
    const file = this.getReadAndAppendBinaryFile(filePath)

    await file.open()

    const { parsedData: parsedPreviousData } = await this.getParsedFileData(
      file,
    )
    const updatedData = parsedPreviousData
      ? [...parsedPreviousData, ...data]
      : data
    const updatedDataString = JSON.stringify(updatedData)

    await file.writeString(updatedDataString)
    await file.close()

    return updatedData
  }

  protected async readFile(filePath: string) {
    const file = this.getReadAndAppendBinaryFile(filePath)

    await file.open()
    const { data, parsedData } = await this.getParsedFileData(file)
    await file.close()

    if (!data) {
      return []
    }

    return parsedData
  }

  private async getParsedFileData(file: BinaryFile) {
    const dataSize = await file.readUInt32()
    const data = await file.readString(dataSize)
    const parsedData: SchemaType[] = data ? JSON.parse(data) : []
    return new ParsedFileResult(data, parsedData)
  }

  private getReadAndAppendBinaryFile(filePath: string) {
    return new BinaryFile(filePath, 'a+')
  }
}
