import express from 'express'

import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getSingleReview,
} from '../controllers/ReviewController'
import AuthenticateUser from '../middleware/authMiddleWare'

const router = express.Router()

router.route('/').get(getAllReviews).post(AuthenticateUser, createReview)
router
  .route('/:id')
  .get(getSingleReview)
  .patch(AuthenticateUser, updateReview)
  .delete(AuthenticateUser, deleteReview)

export default router
