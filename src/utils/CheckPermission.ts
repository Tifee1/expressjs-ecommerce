import { Types } from 'mongoose'

import { Unauthorized } from '../error'

const checkPermission = (
  reqUser: {
    name: string
    role: string
    userId: string
  },
  resourceId: Types.ObjectId
) => {
  if (reqUser.role === 'admin') return
  if (reqUser.userId === resourceId.toString()) return

  throw new Unauthorized('Forbidden from accesing this route')
}

export default checkPermission
