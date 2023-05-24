import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-error'

class Unauthenticated extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN)
  }
}

export default Unauthenticated
