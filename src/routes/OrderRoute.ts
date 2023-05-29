import express from 'express'
import AuthenticateUser from '../middleware/authMiddleWare'
import AuthorizePermission from '../middleware/authorizeMiddleWare'

import {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} from '../controllers/OrderController'

const router = express.Router()

router
  .route('/')
  .get(AuthenticateUser, AuthorizePermission('admin'), getAllOrders)
  .post(AuthenticateUser, createOrder)
router.route('/user').get(AuthenticateUser, getCurrentUserOrders)
router
  .route('/:id')
  .get(AuthenticateUser, getSingleOrder)
  .patch(AuthenticateUser, updateOrder)

export default router
