import { Schema } from 'mongoose'

import { IProduct } from '../models/Product'

export default abstract class CustomObjectId extends Schema.Types.ObjectId {
  public _doc?: IProduct[]
}