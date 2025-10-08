import type { Session as SessionType } from './session'

declare global {
  // Global Session type derived from entities (see modules/auth/types/session.ts)
  type Session = SessionType

  namespace Express {
    interface Request {
      session?: Session
    }
  }
}

export {}
