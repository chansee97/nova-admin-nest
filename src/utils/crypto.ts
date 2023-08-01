import { createHash } from 'node:crypto'
import { Buffer } from 'node:buffer'

// 加密函数
export function encryptData(data: any, algorithm = 'sha256') {
  const hash = createHash(algorithm)
  const bufferData = Buffer.from(data as string)
  hash.update(bufferData)
  const encrypted = hash.digest('hex')
  return encrypted
}
