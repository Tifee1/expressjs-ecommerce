import { Schema, model, Model, Types, Document } from 'mongoose'
import ProductModel from '../models/Product'

interface ReviewSchemaType {
  title: string
  comment: string
  rating: number
  product: typeof Types.ObjectId
  user: typeof Types.ObjectId
}

interface ReviewDocument extends Document, ReviewSchemaType {}

interface ReviewModel extends Model<ReviewDocument> {
  calculateReviews: (productId: typeof Types.ObjectId) => void
}

const ReviewSchema = new Schema<ReviewDocument, ReviewModel>({
  title: {
    type: String,
    required: [true, 'Please provide title'],
    maxlength: [40, 'Title too long'],
  },
  comment: {
    type: String,
    required: [true, 'Please provide comment'],
    maxlength: [500, 'Comment too long'],
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 0,
    max: 5,
  },
  product: {
    type: Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  user: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
})

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

ReviewSchema.statics.calculateReviews = async function (
  productId: typeof Types.ObjectId
) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        numOfReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ])
  // as { _id: null; numOfReviews: number; averageRating: number }[]

  console.log(result)

  try {
    await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        numOfReviews: result[0].numOfReviews || 0,
        averageRating: Math.ceil(result[0].averageRating || 0),
      }
    )
  } catch (error) {
    console.log(error)
  }
}

ReviewSchema.post<ReviewDocument>('save', async function () {
  await (this.constructor as ReviewModel).calculateReviews(this.product)
})
ReviewSchema.post<ReviewDocument>('deleteOne', async function () {
  await (this.constructor as ReviewModel).calculateReviews(this.product)
})

export default model<ReviewDocument, ReviewModel>('Reviews', ReviewSchema)
