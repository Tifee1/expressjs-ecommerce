import { Request, Response, NextFunction } from 'express'

import { isTokenValid } from '../utils'
import { Unauthenticated } from '../error'

const AuthenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new Unauthenticated('Not authorized to this route')
  }
  try {
    const payload = isTokenValid(token)
    const { name, userId, role } = payload

    req.user = { name, userId, role }

    next()
  } catch (error) {
    throw new Unauthenticated('Token not valid')
  }
}

export default AuthenticateUser
