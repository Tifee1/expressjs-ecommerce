import { Schema, model, Types } from 'mongoose'

type ProductSchemaType = {
  name: string
  price: number
  description: string
  image: string
  company: string
  category: string
  colors: string[]
  freeShipping: boolean
  featured: boolean
  averageRating: number
  numOfReviews: number
  inventory: number
  user: typeof Types.ObjectId
}

const ProductSchema = new Schema<ProductSchemaType>(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      maxlength: [30, 'Product name too long'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Product description too long'],
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/diit2c1yg/image/upload/v1684622946/file-upload/tmp-1-1684622944557_ahp3j9.jpg',
    },
    company: {
      type: String,
      required: [true, 'Please enter product category'],
      enum: {
        values: ['marcos', 'liddy', 'ikea'],
        message: '{VALUE} not supported',
      },
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
      enum: {
        values: ['bedroom', 'kitchen', 'office'],
        message: '{VALUE} not supported',
      },
    },
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 5,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    inventory: {
      type: Number,
      default: 20,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export default model<ProductSchemaType>('Product', ProductSchema)
