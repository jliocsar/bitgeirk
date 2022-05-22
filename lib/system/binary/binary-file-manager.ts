import fs from 'node:fs'
import asyncFs from 'node:fs/promises'

import { pathExists } from '../system.utils'

const BINARY = 'binary'
const DEFAULT_EMPTY_FILE_VALUE = '[]'
const STREAM_OPTIONS = {
  encoding: 'binary',
} as const

export class BinaryFileManager<SchemaType> {
  protected async writeFile(filePath: string, data: SchemaType[]) {
    return new Promise<void>((resolve, reject) => {
      const stream = fs.createWriteStream(filePath, STREAM_OPTIONS)
      const dataString = JSON.stringify(data)
      const buffer = Buffer.from(dataString, BINARY)
      stream.write(buffer, BINARY, error => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  }

  protected async readFile(
    filePath: string,
    defaultInitialValue = DEFAULT_EMPTY_FILE_VALUE,
  ) {
    return new Promise<string>(async (resolve, reject) => {
      const isExistingFilePath = await pathExists(filePath)

      if (!isExistingFilePath) {
        await asyncFs.writeFile(filePath, defaultInitialValue, STREAM_OPTIONS)
      }

      const chunks: string[] = []
      const stream = fs.createReadStream(filePath, STREAM_OPTIONS)
      stream.on('data', chunk => chunks.push(chunk as string))
      stream.on('end', () => resolve(chunks.join('')))
      stream.on('error', reject)
    })
  }
}
