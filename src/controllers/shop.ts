import { RequestHandler } from "express"

import Product from '../models/Product'

export const getProducts: RequestHandler = (_, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      path: '/products',
      products 
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