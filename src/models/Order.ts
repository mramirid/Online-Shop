import { ObjectId } from "mongodb";

export default interface Order {
  items: {
    quantity: number,
    title: string,
    price: number,
    imageUrl: string,
    description: string,
    _id?: ObjectId,
    userId?: ObjectId
  }[]

  user: {
    _id: ObjectId,
    name: string
  }
}