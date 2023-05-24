import { BadRequest, NotFoundError, Unauthenticated } from '../error'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import UserModel from '../models/User'
import { attachCookiesToResponse, createTokenUser } from '../utils'
import checkPermission from '../utils/CheckPermission'

const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find({}).select('-password')
  res.status(StatusCodes.OK).json(users)
}
const getSingleUser = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ _id: req.params.id }).select(
    '-password -email'
  )
  if (!user) {
    throw new NotFoundError(`No user with id ${req.user.userId}`)
  }
  checkPermission(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}
const showCurrentUser = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}
const updateUser = async (req: Request, res: Response) => {
  const { email, name } = req.body
  if (!email || !name) {
    throw new BadRequest('Please fill all values')
  }

  const user = await UserModel.findOne({ _id: req.user.userId })

  if (!user) {
    throw new NotFoundError(`No user with id ${req.user.userId}`)
  }

  user.name = name
  user.email = email

  await user.save()

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse(tokenUser, res)

  res.status(StatusCodes.OK).json({ user: tokenUser })
}
const updateUserPassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    throw new BadRequest('Please provide all values')
  }

  const user = await UserModel.findOne({ _id: req.user.userId })
  if (!user) {
    throw new NotFoundError(`No user with id ${req.user.userId}`)
  }
  const isPasswordCorrect = await user.comparePassword(oldPassword)

  if (!isPasswordCorrect) {
    throw new Unauthenticated('Old Password Incorrect')
  }

  user.password = newPassword
  await user.save()

  res.status(StatusCodes.OK).json({ msg: 'Password Changed' })
}

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
}
