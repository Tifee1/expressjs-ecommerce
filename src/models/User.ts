import { model, Model, Schema, Document } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

export type UserSchemaType = {
  name: string
  password: string
  email: string
  role: string
}

type UserSchemaMethods = {
  comparePassword: (password2: string) => Promise<boolean>
}

type UserModel = Model<UserSchemaType, {}, UserSchemaMethods>

const UserSchema = new Schema<UserSchemaType, UserModel, UserSchemaMethods>({
  name: {
    type: String,
    required: [true, 'Please enter a valid name'],
    maxlength: [25, 'Name too long'],
    minlength: [3, 'Name too short'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter a valid email'],
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please enter a valid password'],
    minlength: [5, 'Password too short'],
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (password2: string) {
  return await bcrypt.compare(password2, this.password)
}

export default model<UserSchemaType, UserModel>('User', UserSchema)
