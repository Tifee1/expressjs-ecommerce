import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-error'

class Unauthenticated extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED)
  }
}

export default Unauthenticated
