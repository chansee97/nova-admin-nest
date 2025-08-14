import * as log4js from 'log4js'

// log4js.configure({
//   appenders: { out: { type: 'stdout', layout: { type: 'basic' } } },
//   categories: { default: { appenders: ['out'], level: 'info' } },
// })

export function logger(category = '[NOVA]') {
  const _logger = log4js.getLogger(category)
  _logger.level = 'debug'
  return _logger
}
