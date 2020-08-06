import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
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

export interface IUser extends mongoose.Document {
  name: string
  email: string
  cart: {
    items: {
      productId: Schema.Types.ObjectId,
      quantity: number
    }
  }
}

export default mongoose.model<IUser>('User', userSchema)

// import { getDb } from '../utils/database'
// import { ObjectId } from 'mongodb'

// import Product from './Product'
// import Order from './Order'

// interface UserCart {
//   items: {
//     productId: ObjectId
//     quantity: number
//   }[]
// }

// export default class User {
//   constructor(
//     public name: string,
//     public email: string,
//     public cart: UserCart,
//     public _id: ObjectId
//   ) { }

//   save() {
//     return getDb().collection('users').insertOne(this)
//   }

//   addToCart(product: Product) {
//     const cartProductIndex = this.cart.items.findIndex(cartProduct => {
//       return cartProduct.productId.toString() === product._id!.toString()
//     })

//     if (cartProductIndex >= 0) {
//       this.cart.items[cartProductIndex].quantity += 1
//     } else {
//       this.cart.items.push({ productId: new ObjectId(product._id), quantity: 1 })
//     }

//     return getDb().collection('users').updateOne(
//       { _id: this._id },
//       { $set: { cart: this.cart } }
//     )
//   }

//   async getCart() {
//     const productIds = this.cart.items.map(cartProduct => cartProduct.productId)
//     const products: Product[] = await getDb()
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()

//     return products.map(product => {
//       return {
//         ...product,
//         quantity: this.cart.items.find(cartProduct => {
//           return cartProduct.productId.toString() === product._id!.toString()
//         })!.quantity
//       }
//     })
//   }

//   deleteItemFromCart(productId: string) {
//     this.cart.items = this.cart.items.filter(cartProduct => {
//       return cartProduct.productId.toString() !== productId
//     })

//     return getDb().collection('users').updateOne(
//       { _id: this._id },
//       { $set: { cart: { items: this.cart.items } } }
//     )
//   }

//   async addOrder() {
//     const cartProducts = await this.getCart()
//     const order: Order = {
//       items: cartProducts,
//       user: {
//         _id: this._id,
//         name: this.name
//       }
//     }
//     await getDb().collection('orders').insertOne(order)

//     this.cart = { items: [] }
//     getDb().collection('users').updateOne(
//       { _id: this._id },
//       { $set: { cart: { items: [] } } }
//     )
//   }

//   getOrders(): Promise<Order[]> {
//     return getDb().collection('orders').find({'user._id': this._id}).toArray()
//   }

//   static findById(userId: string): Promise<User | null> {
//     try {
//       return getDb().collection('users').findOne({ _id: new ObjectId(userId) })
//     } catch (error) {
//       throw error
//     }
//   }
// }