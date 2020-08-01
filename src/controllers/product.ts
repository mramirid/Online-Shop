import { RequestHandler } from "express"

interface Product {
  title: string
}

const products: Product[] = []

export const getAddProduct: RequestHandler = (_, res) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  })
}

export const postAddProduct: RequestHandler = (req, res) => {
  products.push({ title: req.body.title })
  res.redirect('/')
}

export const getProducts: RequestHandler = (_, res) => {
  res.render('shop', {
    pageTitle: 'Shop',
    path: '/',
    products
  })
}