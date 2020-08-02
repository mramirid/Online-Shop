import fs from 'fs'
import path from 'path'

import activeDir from '../utils/path'

const filePath = path.join(activeDir, 'data', 'products.json')

const getProductsFromFile = (callback: (products: Product[]) => void) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) callback([])
    else callback(JSON.parse(fileContent.toString()))
  })
}

export default class Product {
  id!: string

  constructor(
    public title: string,
    public imageUrl: string,
    public description: string,
    public price: number
  ) { }

  save() {
    this.id = Math.random().toString()
    getProductsFromFile(products => {
      products.push(this)
      fs.writeFile(filePath, JSON.stringify(products), err => {
        console.log(err)
      })
    })
  }

  static fetchAll(callback: (products: Product[]) => void) {
    getProductsFromFile(callback)
  }

  static findById(id: string, callback: (product: Product) => void) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id)!
      callback(product)
    })
  }
}