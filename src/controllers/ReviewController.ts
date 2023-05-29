import { Response, Request } from 'express'
import { StatusCodes } from 'http-status-codes'

import ReviewModel from '../models/Reviews'
import ProductModel from '../models/Product'
import { BadRequest, NotFoundError } from '../error'
import checkPermission from '../utils/CheckPermission'

const createReview = async (req: Request, res: Response) => {
  const { product: productId } = req.body

  const isValidProduct = await ProductModel.findOne({ _id: productId })

  if (!isValidProduct) {
    throw new NotFoundError(`No product with id ${productId} found`)
  }

  const alreadySubmitted = await ReviewModel.findOne({
    user: req.user.userId,
    product: productId,
  })

  if (alreadySubmitted) {
    throw new BadRequest('Already submitted review for this product')
  }

  req.body.user = req.user.userId
  const review = await ReviewModel.create(req.body)

  res.status(StatusCodes.CREATED).json({ review })
}
const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await ReviewModel.find({}).populate({
    path: 'product',
    select: 'name price company',
  })

  res.status(StatusCodes.OK).json({ nbOfHits: reviews.length, reviews })
}
const getSingleReview = async (req: Request, res: Response) => {
  const review = await ReviewModel.findOne({ _id: req.params.id })

  if (!review) {
    throw new NotFoundError(`No review with id ${req.params.id}`)
  }

  res.status(StatusCodes.OK).json({ review })
}
const updateReview = async (req: Request, res: Response) => {
  const { title, comment, rating } = req.body

  if (!title || !comment || !rating) {
    throw new BadRequest('Please provide all values')
  }

  const review = await ReviewModel.findOne({ _id: req.params.id })

  if (!review) {
    throw new NotFoundError(`No review with id ${req.params.id}`)
  }

  checkPermission(req.user, review.user)

  review.title = title
  review.comment = comment
  review.rating = rating

  await review.save()

  res.status(StatusCodes.OK).json({ review })
}
const deleteReview = async (req: Request, res: Response) => {
  const review = await ReviewModel.findOne({ _id: req.params.id })

  if (!review) {
    throw new NotFoundError(`No review with id ${req.params.id}`)
  }

  checkPermission(req.user, review.user)

  await review.deleteOne()

  res.status(StatusCodes.OK).json({ msg: 'Review successfully deleted' })
}

const getProductReviews = async (req: Request, res: Response) => {
  const { id: productId } = req.params

  const isValidProduct = await ProductModel.findOne({ _id: productId })

  if (!isValidProduct) {
    throw new NotFoundError(`No product with id ${productId} found`)
  }

  const reviews = await ReviewModel.find({ product: productId })

  res.status(StatusCodes.OK).json({ nbOfHits: reviews.length, reviews })
}

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getProductReviews,
}
