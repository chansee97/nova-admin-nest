export function getEnvFilePath() {
  const isDev = process.env.NODE_ENV === 'dev'
  const envFilePath = ['.env']
  if (isDev) {
    envFilePath.unshift('.env.dev')
  } else {
    envFilePath.unshift('.env.prod')
  }
  return envFilePath
}

export function getEnvVar(targetName: string) {
  return process.env[targetName]
}
