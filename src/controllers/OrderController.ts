import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import checkPermission from '../utils/CheckPermission'
import OrderModel from '../models/Order'
import ProductModel from '../models/Product'
import { BadRequest, NotFoundError } from '../error'

type cartItemType = {
  name: string
  price: number
  image: string
  amount: number
  product: string | Types.ObjectId
}

const fakeStripeAPI = async (amount: number) => {
  const client_secret = new Date().getTime()
  return { client_secret, amount }
}

const getAllOrders = async (req: Request, res: Response) => {
  const orders = await OrderModel.find({})
  res.status(StatusCodes.OK).json({ nbOfHits: orders.length, orders })
}

const getSingleOrder = async (req: Request, res: Response) => {
  const { id: orderId } = req.params
  const order = await OrderModel.findOne({ _id: orderId })

  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`)
  }
  checkPermission(req.user, order.user)

  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req: Request, res: Response) => {
  const orders = await OrderModel.find({ user: req.user.userId })
  res.status(StatusCodes.OK).json({ nbOfHits: orders.length, orders })
}

const createOrder = async (req: Request, res: Response) => {
  const { items: cartItem, tax, shippingFee } = req.body

  if (cartItem.length < 1) {
    throw new BadRequest('No item in the cart')
  }
  if (!tax || !shippingFee) {
    throw new BadRequest('Shipping fee and tax not provided')
  }

  let cart: cartItemType[] = []

  let subtotal = 0

  for (const item of cartItem) {
    if (!item.product || !item.amount) {
      throw new BadRequest('Cart Item provided is invalid')
    }
    const dbProduct = await ProductModel.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new NotFoundError(`Product with id ${item.product} not found`)
    }

    const { name, price, image, _id } = dbProduct

    const newCartItem: cartItemType = {
      name,
      price,
      image,
      product: _id,
      amount: item.amount,
    }

    cart = [...cart, newCartItem]
    subtotal += price * item.amount
  }

  const total = tax + shippingFee + subtotal

  const payment = await fakeStripeAPI(total)

  const order = await OrderModel.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems: cart,
    user: req.user.userId,
    clientSecret: payment.client_secret,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}

const updateOrder = async (req: Request, res: Response) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body
  if (!paymentIntentId) {
    throw new BadRequest('No payment Id Provided')
  }
  const order = await OrderModel.findOne({ _id: orderId })

  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`)
  }

  checkPermission(req.user, order.user)

  order.paymentId = paymentIntentId
  order.status = 'paid'
  await order.save()

  res.status(StatusCodes.OK).json({ order })
}

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
