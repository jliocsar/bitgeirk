import path from 'node:path'
import fs from 'node:fs/promises'

import BinaryFile from 'binary-file'

export const SEPARATE_CHARACTER = '\u0000'

export class BinaryFileManager<FileSchemaType> {
  private file: BinaryFile

  constructor(private readonly filePath: string) {
    if (!path.isAbsolute(filePath)) {
      throw new Error("'filePath' must be absolute")
    }

    this.file = new BinaryFile(filePath, 'a+')
  }

  async readFile() {
    const dataSize = await this.file.size()
    console.log({ dataSize })
    const rawData = await this.file.readString(dataSize)
    const data = rawData ? rawData.split(SEPARATE_CHARACTER) : []

    return {
      data,
      rawData,
    }
  }

  async writeToFile(data: FileSchemaType[]) {
    const stringifiedData = JSON.stringify(data)

    if (stringifiedData.includes(SEPARATE_CHARACTER)) {
      throw new Error(`${SEPARATE_CHARACTER} is not allowed in data`)
    }

    const { rawData: previousData } = await this.readFile()
    const writeData = previousData
      ? previousData.concat(SEPARATE_CHARACTER, stringifiedData)
      : stringifiedData

    await this.file.writeString(writeData)

    return data
  }

  async start() {
    const filePathFolder = path.dirname(this.filePath)
    const folderExists = await this.pathExists(filePathFolder)

    if (!folderExists) {
      await this.createWriteFolder(filePathFolder)
    }

    await this.file.open()
  }

  async stop() {
    await this.file.close()
  }

  async createWriteFolder(folderPath: string) {
    return fs.mkdir(folderPath, {
      recursive: true,
    })
  }

  private async pathExists(filePath: string) {
    try {
      await fs.access(filePath)
      return true
    } catch (error) {
      return false
    }
  }
}
