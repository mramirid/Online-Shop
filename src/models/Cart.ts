import fs from 'fs'
import path from 'path'

import activeDir from '../utils/path'

const filePath = path.join(activeDir, 'data', 'cart.json')

interface SavedProductEntity {
  id: string
  qty: number
}

interface CartEntity {
  products: SavedProductEntity[]
  totalPrice: number
}

export default class Cart {
  static addProduct(id: string, productPrice: number) {
    // Fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      let cart: CartEntity = { products: [], totalPrice: 0 }

      if (!err) {
        cart = JSON.parse(fileContent.toString())
      }

      // Analyze the cart => find existing product
      let updatedProduct: SavedProductEntity
      const existingProductIndex = cart.products.findIndex(product => product.id === id)
      const existingProduct = cart.products[existingProductIndex]

      // Add new product / increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty += 1
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }

      cart.totalPrice += +productPrice

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err)
      })
    })
  }
}