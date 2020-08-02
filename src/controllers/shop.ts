import { RequestHandler } from 'express'

import Product from '../models/Product'
import Cart from '../models/Cart'

export const getProducts: RequestHandler = (_, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      path: '/products',
      products
    })
  })
}

export const getProduct: RequestHandler = (req, res) => {
  const productId = req.params.productId
  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/products',
      product
    })
  })
}

export const getIndex: RequestHandler = (_, res) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      products
    })
  })
}

export const getCart: RequestHandler = (_, res) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart'
  })
}

export const postCart: RequestHandler = (req, res) => {
  const productId = req.body.productId
  Product.findById(productId, (product => {
    Cart.addProduct(productId, product.price)
    res.redirect('/cart')
  }))
}

export const getOrders: RequestHandler = (_, res) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders'
  })
}

export const getCheckout: RequestHandler = (_, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  })
}