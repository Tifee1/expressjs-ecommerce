import { Request, Response, NextFunction } from 'express'

import { Unauthorized } from '../error'

const AuthorizePermission = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new Unauthorized('Forbidden from this route')
    }
    next()
  }
}

export default AuthorizePermission
