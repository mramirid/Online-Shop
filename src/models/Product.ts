import { RowDataPacket } from 'mysql2'

import db from '../utils/database'
import Cart from '../models/Cart'

interface RowProduct extends RowDataPacket {
  id: string | null,
  title: string,
  imageUrl: string,
  description: string,
  price: number
}

export default class Product {
  constructor(
    public id: string | null,
    public title: string,
    public imageUrl: string,
    public description: string,
    public price: number
  ) { }

  save() {
    return db.execute(
      `INSERT INTO products (title, price, description, imageUrl)
       VALUES (?, ?, ?, ?)`,
      [this.title, this.price, this.description, this.imageUrl]
    )
  }

  static deleteById(id: string) {

  }

  static fetchAll() {
    return db.execute<RowProduct[]>('SELECT * FROM products')
  }

  static findById(id: string) {
    return db.execute<RowProduct[]>('SELECT * FROM products WHERE products.id = ? LIMIT 1', [id])
  }
}