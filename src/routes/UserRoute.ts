import express from 'express'

import {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} from '../controllers/UserController'
import AuthenticateUser from '../middleware/authMiddleWare'
import AuthorizePermission from '../middleware/authorizeMiddleWare'

const router = express.Router()

router.get(
  '/users',
  AuthenticateUser,
  AuthorizePermission('admin'),
  getAllUsers
)
router.get('/:id', AuthenticateUser, getSingleUser)
router.patch('/updateUser', AuthenticateUser, updateUser)
router.patch('/changePassword', AuthenticateUser, updateUserPassword)
router.get('/showUser', AuthenticateUser, showCurrentUser)

export default router
