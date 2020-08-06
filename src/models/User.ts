import { getDb } from '../utils/database'
import { ObjectId } from 'mongodb'

import Product from './Product'

interface Cart {
  items: {
    productId: ObjectId
    quantity: number
  }[]
}

export default class User {
  constructor(
    public name: string,
    public email: string,
    public cart: Cart,
    public _id: ObjectId
  ) { }

  save() {
    return getDb().collection('users').insertOne(this)
  }

  addToCart(product: Product) {
    const cartProductIndex = this.cart.items.findIndex(cartProduct => {
      return cartProduct.productId.toString() === product._id!.toString()
    })

    if (cartProductIndex >= 0) {
      this.cart.items[cartProductIndex].quantity += 1
    } else {
      this.cart.items.push({ productId: new ObjectId(product._id), quantity: 1 })
    }

    return getDb().collection('users').updateOne(
      { _id: this._id },
      { $set: { cart: this.cart } }
    )
  }

  async getCart() {
    const productIds = this.cart.items.map(cartProduct => cartProduct.productId)
    const products: Product[] = await getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()

    return products.map(product => {
      return {
        ...product,
        quantity: this.cart.items.find(cartProduct => {
          return cartProduct.productId.toString() === product._id!.toString()
        })!.quantity
      }
    })
  }

  deleteItemFromCart(productId: string) {
    this.cart.items = this.cart.items.filter(cartProduct => {
      return cartProduct.productId.toString() !== productId
    })

    return getDb().collection('users').updateOne(
      { _id: this._id },
      { $set: { cart: { items: this.cart.items } } }
    )
  }

  static findById(userId: string): Promise<User | null> {
    try {
      return getDb().collection('users').findOne({ _id: new ObjectId(userId) })
    } catch (error) {
      throw error
    }
  }
}