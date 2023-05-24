import { Document } from 'mongoose'
import { UserSchemaType } from '../models/User'

const createTokenUser = (user: UserSchemaType & Document) => {
  return { name: user.name, role: user.role, userId: user._id }
}

export default createTokenUser
