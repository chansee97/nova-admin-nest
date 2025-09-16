import { SetMetadata } from '@nestjs/common'
export const LOG_KEY = 'log'

// Enable operation logging for a handler or an entire controller (class-level)
export const Log = () => SetMetadata(LOG_KEY, true)
