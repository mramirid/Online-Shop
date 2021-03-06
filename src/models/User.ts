import mongoose, { Schema, Document } from 'mongoose'

import { IProduct } from './Product'

export interface IUser extends Document {
  email: string
  password: string
  resetToken?: string
  resetTokenExpiration?: number
  cart: {
    items: {
      productId: IProduct & Schema.Types.ObjectId
      quantity: number
    }[]
  }

  addToCart(product: IProduct): Promise<IUser>
  removeFromCart(productId: string): Promise<IUser>
  clearCart(): Promise<IUser>
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
})

userSchema.methods.addToCart = function (product: IProduct) {
  const cartProductIndex = this.cart.items.findIndex(cartProduct => {
    return cartProduct.productId.toString() === product._id.toString()
  })

  if (cartProductIndex >= 0) {
    this.cart.items[cartProductIndex].quantity += 1
  } else {
    this.cart.items.push({ productId: product._id, quantity: 1 })
  }

  return this.save()
}

userSchema.methods.removeFromCart = function (productId: string) {
  this.cart.items = this.cart.items.filter(cartProduct => {
    return cartProduct.productId.toString() !== productId
  })
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}

export default mongoose.model<IUser>('User', userSchema)