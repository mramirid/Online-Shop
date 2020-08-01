import fs from 'fs'
import path from 'path'

import activeDir from '../utils/path'

const filePath = path.join(activeDir, 'data', 'products.json')

type CallbackType = (products: Product[]) => void

const getProductsFromFile = (callback: CallbackType) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) callback([])
    else callback(JSON.parse(fileContent.toString()))
  })
}

export default class Product {
  constructor(public title: string) { }

  save() {
    getProductsFromFile(products => {
      products.push(this)
      fs.writeFile(filePath, JSON.stringify(products), err => {
        console.log(err)
      })
    })
  }

  static fetchAll(callback: CallbackType) {
    getProductsFromFile(callback)
  }
}