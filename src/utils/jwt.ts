import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response } from 'express'

type UserType = {
  name: string
  userId: string
  role: string
}

export const createJWT = (payload: UserType) => {
  if (!process.env.JWT_SECRET_KEY || !process.env.JWT_LIFETIME) {
    throw new Error('no env keys provided in development or production')
  }

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

export const isTokenValid = (token: string) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('No env keys provided in development or production')
  }

  return jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload & {
    name: string
    role: string
    userId: string
  }
}

export const attachCookiesToResponse = (user: UserType, res: Response) => {
  const token = createJWT(user)
  const oneDay = 24 * 60 * 60 * 1000

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}
