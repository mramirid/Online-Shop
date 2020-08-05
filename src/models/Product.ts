import { ObjectId } from 'mongodb'

import { getDb } from '../utils/database'

export default class Product {
  constructor(
    public title: string,
    public price: number,
    public imageUrl: string,
    public description: string
  ) { }

  save() {
    try {
      return getDb().collection('products').insertOne(this)
    } catch (error) {
      throw error
    }
  }

  static fetchAll() {
    try {
      return getDb().collection('products').find().toArray()
    } catch (error) {
      throw error
    }
  }

  static findById(productId: string) {
    try {
      return getDb().collection('products').findOne({ _id: new ObjectId(productId) })
    } catch (error) {
      throw error
    }
  }
}