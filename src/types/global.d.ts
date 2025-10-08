import type { Session as SessionType } from './session'

declare global {
  type Session = SessionType

  namespace Express {
    interface Request {
      session?: Session
    }
  }
}

export {}
