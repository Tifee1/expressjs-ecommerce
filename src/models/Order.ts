import { Schema, Types, model } from 'mongoose'

type SingleOrderItemType = {
  name: string
  image: string
  price: number
  amount: number
  product: typeof Types.ObjectId
}

type OrderSchemaType = {
  tax: number
  shippingFee: number
  subtotal: number
  total: number
  orderItems: SingleOrderItemType[]
  status: string
  user: typeof Types.ObjectId
  clientSecret: string
  paymentId: string
}

const SingleOrderItem = new Schema<SingleOrderItemType>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

const OrderSchema = new Schema(
  {
    tax: { type: Number, required: [true, 'Please provide tax amount'] },
    shippingFee: {
      type: Number,
      required: [true, 'Please provide shipping fee'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Please provide subtotal amount'],
    },
    total: { type: Number, required: [true, 'Please provide total amount'] },
    orderItems: {
      type: [SingleOrderItem],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
      default: 'pending',
    },
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
)

export default model<OrderSchemaType>('Order', OrderSchema)
