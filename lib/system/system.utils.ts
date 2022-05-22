import fs from 'node:fs/promises'

export async function pathExists(testPath: string) {
  try {
    await fs.access(testPath)
    return true
  } catch {
    return false
  }
}
