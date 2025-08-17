import * as log4js from 'log4js'

export function logger(category = '[NOVA]') {
  const _logger = log4js.getLogger(category)
  _logger.level = 'debug'
  return _logger
}
