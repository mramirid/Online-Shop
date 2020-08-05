import { ObjectId } from 'mongodb'

import { getDb } from '../utils/database'

export default class Product {
  public _id?: ObjectId
  public userId?: ObjectId

  constructor(
    public title: string,
    public price: number,
    public imageUrl: string,
    public description: string,
    id?: string,
    userId?: string
  ) {
    this._id = id ? new ObjectId(id) : undefined
    this.userId = userId ? new ObjectId(userId) : undefined
  }

  save() {
    try {
      if (this._id) {
        return getDb().collection('products').updateOne({ _id: this._id }, { $set: this })
      } else {
        return getDb().collection('products').insertOne(this)
      }
    } catch (error) {
      throw error
    }
  }

  static fetchAll(): Promise<Product[]> {
    try {
      return getDb().collection('products').find().toArray()
    } catch (error) {
      throw error
    }
  }

  static findById(productId: string): Promise<Product | null> {
    try {
      return getDb().collection('products').findOne({ _id: new ObjectId(productId) })
    } catch (error) {
      throw error
    }
  }

  static deleteById(productId: string) {
    try {
      return getDb().collection('products').deleteOne({ _id: new ObjectId(productId) })
    } catch (error) {
      console.log(error)
    }
  }
}