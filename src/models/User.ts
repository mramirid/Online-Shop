import { getDb } from '../utils/database'
import { ObjectId } from 'mongodb'

export default class User {
  public _id?: string

  constructor(
    public name: string,
    public email: string
  ) { }

  save() {
    return getDb().collection('users').insertOne(this)
  }

  static findById(userId: string): Promise<User | null> {
    try {
      return getDb().collection('users').findOne({ _id: new ObjectId(userId) })
    } catch (error) {
      throw error
    }
  }
}