import { getDb } from '../utils/database'

export default class Product {
  constructor(
    public title: string,
    public price: number,
    public imageUrl: string,
    public description: string
  ) { }

  async save() {
    try {
      const db = getDb()
      return await db.collection('products').insertOne(this)
    } catch (error) {
      throw error
    }
  }
}