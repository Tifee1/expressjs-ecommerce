import { BadRequest, NotFoundError, Unauthenticated } from '../error'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import UserModel from '../models/User'
import { attachCookiesToResponse, createTokenUser } from '../utils'

// Register user
const registerUser = async (req: Request, res: Response) => {
  const { email, name, password } = req.body
  const emailExist = await UserModel.findOne({ email })
  if (emailExist) {
    throw new BadRequest('Email already exist')
  }
  const firstUser = (await UserModel.countDocuments()) === 0

  const role = firstUser ? 'admin' : 'user'

  const user = await UserModel.create({ email, password, name, role })

  const tokenUser = createTokenUser(user)

  attachCookiesToResponse(tokenUser, res)

  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

// Login User
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequest('Please provide a valid emailand password')
  }
  const user = await UserModel.findOne({ email })
  if (!user) {
    throw new NotFoundError('User dosent exist')
  }
  const isCorrect = await user.comparePassword(password)

  if (!isCorrect) {
    throw new Unauthenticated('Password not correct')
  }
  const tokenUser = createTokenUser(user)

  attachCookiesToResponse(tokenUser, res)

  res.status(StatusCodes.OK).json({ user: tokenUser })
}

// logout User
const logoutUser = (req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })
  res.status(StatusCodes.OK).json({ msg: 'User logged out' })
}

export { loginUser, registerUser, logoutUser }
