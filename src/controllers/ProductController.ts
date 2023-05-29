import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UploadedFile } from 'express-fileupload'

import ProductModel from '../models/Product'
import { BadRequest, NotFoundError } from '../error'
import path from 'path'

const createProduct = async (req: Request, res: Response) => {
  req.body.user = req.user.userId
  const product = await ProductModel.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req: Request, res: Response) => {
  const products = await ProductModel.find({})
  res.status(StatusCodes.OK).json({ products, nbOfHits: products.length })
}

const getSingleProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findOne({ _id: req.params.id })
  if (!product) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`)
  }
  res.status(StatusCodes.OK).json({ product })
}
const updateProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  )
  if (!product) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`)
  }
  res.status(StatusCodes.OK).json({ product })
}
const deleteProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findOne({ _id: req.params.id })
  if (!product) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`)
  }
  await product.deleteOne()
  res.status(StatusCodes.OK).json({ msg: 'Product deleted' })
}

const uploadImage = async (req: Request, res: Response) => {
  if (!req.files) {
    throw new BadRequest('No image selected')
  }

  const productImage = req.files.img as UploadedFile

  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequest('Please select an image file')
  }
  if (productImage.size > 1024 * 1024 * 2) {
    throw new BadRequest('Image bigger than 2mb')
  }

  const imagePath = path.join(__dirname, '../image/' + `${productImage.name}`)

  await productImage.mv(imagePath)

  res
    .status(StatusCodes.OK)
    .json({ img: { src: `/src/image/${productImage.name}` } })
}

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
