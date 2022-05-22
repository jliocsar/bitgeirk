import { BinaryTableManager } from '~/system/binary'

import type { DatabaseSchema } from '../database-schema'
import { WriteDocumentsFunction } from './write-worker.types'

const write: WriteDocumentsFunction = async ({ documents, writePath }) => {
  const binaryTableManager = new BinaryTableManager<DatabaseSchema>({
    filePath: writePath,
  })

  await binaryTableManager.appendRows(documents)

  return documents
}

export default write
