import { RequestHandler } from "express"

import Product from '../models/Product'

export const getAddProduct: RequestHandler = (_, res) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  })
}

export const postAddProduct: RequestHandler = (req, res) => {
  const product = new Product(req.body.title)
  product.save()
  res.redirect('/')
}

export const getProducts: RequestHandler = (_, res) => {
  Product.fetchAll(products => {
    res.render('shop', {
      pageTitle: 'Shop',
      path: '/',
      products 
    })
  })
}