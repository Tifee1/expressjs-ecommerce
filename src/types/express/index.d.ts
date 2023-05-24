import { Request } from 'express'

declare global {
  namespace Express {
    export interface Request {
      user: User // Add your custom properties here
      // Add more custom properties if needed
    }
  }
}

type User = any
