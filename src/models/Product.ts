import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  title: string
  price: number
  description: string
  imageUrl: string
  userId: Schema.Types.ObjectId
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export default mongoose.model<IProduct>('Product', productSchema)