import process from 'node:process'

export function getEnvFilePath() {
  const isDev = process.env.NODE_ENV === 'dev'
  const envFilePath = ['.env']
  isDev ? envFilePath.unshift('.env.dev') : envFilePath.unshift('.env.prod')
  return envFilePath
}

export function getEnvVar(targetName: string) {
  return process.env[targetName]
}
