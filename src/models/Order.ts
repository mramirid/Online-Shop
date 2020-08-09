import mongoose, { Schema, Document } from 'mongoose'

import { IProduct } from './Product'

export interface IOrder extends Document {
  products: {
    product: IProduct
    quantity: number
  }[]
  user: {
    email: string
    userId: Schema.Types.ObjectId
  }
}

const orderSchema = new Schema<IOrder>({
  products: [
    {
      product: {
        type: Object,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  user: {
    email: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }
})

export default mongoose.model<IOrder>('Order', orderSchema)