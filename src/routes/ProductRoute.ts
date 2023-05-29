import express from 'express'

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
} from '../controllers/ProductController'
import { getProductReviews } from '../controllers/ReviewController'
import AuthenticateUser from '../middleware/authMiddleWare'
import AuthorizePermission from '../middleware/authorizeMiddleWare'

const router = express.Router()

router
  .route('/')
  .get(getAllProducts)
  .post(AuthenticateUser, AuthorizePermission('admin'), createProduct)
router
  .route('/uploadImage')
  .post(AuthenticateUser, AuthorizePermission('admin'), uploadImage)
router
  .route('/:id')
  .get(getSingleProduct)
  .patch(AuthenticateUser, AuthorizePermission('admin'), updateProduct)
  .delete(AuthenticateUser, AuthorizePermission('admin'), deleteProduct)

router.route('/:id/reviews').get(getProductReviews)

export default router
