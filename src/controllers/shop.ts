import { RequestHandler } from 'express'

import Product from '../models/Product'
import Order from '../models/Order'

export const getIndex: RequestHandler = async (_, res, next) => {
  try {
    const products = await Product.find()
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      products
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getProducts: RequestHandler = async (_, res, next) => {
  try {
    const products = await Product.find()
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      path: '/products',
      products
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getProduct: RequestHandler = async (req, res, next) => {
  const productId = req.params.productId
  try {
    const product = await Product.findById(productId)
    res.render('shop/product-detail', {
      pageTitle: product!.title,
      path: '/products',
      product
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getCart: RequestHandler = async (req, res, next) => {
  try {
    const userAndCart = await req.user.populate('cart.items.productId').execPopulate()
    const cartProducts = userAndCart.cart.items
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
      products: cartProducts
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const postCart: RequestHandler = async (req, res, next) => {
  try {
    const productId = req.body.productId
    const product = await Product.findById(productId)
    await req.user.addToCart(product!)
    res.redirect('/cart')
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const postCartDeleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const productId = req.body.productId
    await req.user.removeFromCart(productId)
    res.redirect('/cart')
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const postOrder: RequestHandler = async (req, res, next) => {
  try {
    const userAndCart = await req.user.populate('cart.items.productId').execPopulate()
    const cartProducts = userAndCart.cart.items.map(cartProduct => {
      return {
        quantity: cartProduct.quantity,
        product: { ...cartProduct.productId._doc }
      }
    })

    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user._id
      },
      products: cartProducts
    })

    await order.save()
    await req.user.clearCart()
    res.redirect('/orders')

  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getOrders: RequestHandler = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getCheckout: RequestHandler = (_, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: false
  })
}