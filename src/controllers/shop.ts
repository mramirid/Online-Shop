import { RequestHandler } from 'express'

import Product from '../models/Product'

export const getProducts: RequestHandler = async (_, res) => {
  try {
    const products = await Product.fetchAll()
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      path: '/products',
      products
    })
  } catch (error) {
    console.log(error)
  }
}

export const getProduct: RequestHandler = async (req, res) => {
  const productId = req.params.productId
  try {
    const product = await Product.findById(productId)
    res.render('shop/product-detail', {
      pageTitle: product!.title,
      path: '/products',
      product
    })
  } catch (error) {
    console.log(error)
  }
}

export const getIndex: RequestHandler = async (_, res) => {
  try {
    const products = await Product.fetchAll()
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      products
    })
  } catch (error) {
    console.log(error)
  }
}

export const getCart: RequestHandler = async (req, res) => {
  try {
    const cartProducts = await req.user!.getCart()
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
      products: cartProducts
    })
  } catch (error) {
    console.log(error)
  }
}

export const postCart: RequestHandler = async (req, res) => {
  try {
    const productId = req.body.productId
    const product = await Product.findById(productId) as Product
    await req.user!.addToCart(product)
    res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

export const postCartDeleteProduct: RequestHandler = async (req, res) => {
  try {
    const productId = req.body.productId
    await req.user!.deleteItemFromCart(productId)
    res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

export const postOrder: RequestHandler = async (req, res) => {
  try {
    await req.user!.addOrder()
    res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }
}

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await req.user!.getOrders()
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders
    })
  } catch (error) {
    console.log(error)
  }
}

export const getCheckout: RequestHandler = (_, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  })
}