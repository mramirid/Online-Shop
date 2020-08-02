import { RequestHandler } from "express"

import Product from '../models/Product'

export const getAddProduct: RequestHandler = (_, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  })
}

export const postAddProduct: RequestHandler = (req, res) => {
  const title: string = req.body.title
  const imageUrl: string = req.body.imageUrl
  const description: string = req.body.description
  const price: number = req.body.price

  console.log(title, imageUrl, description, price)
  
  const product = new Product(title, imageUrl, description, price)
  product.save()
  res.redirect('/')
}

export const getProducts: RequestHandler = (_, res) => {
  Product.fetchAll(products => {
    res.render('admin/product-list', {
      pageTitle: 'Admin Products',
      path: '/admin/product-list',
      products
    })
  })
}