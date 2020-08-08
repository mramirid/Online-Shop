import { RequestHandler } from 'express'

import Product from '../models/Product'
import Order from '../models/Order'

export const getIndex: RequestHandler = async (req, res) => {
  try {
    const products = await Product.find()
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated: req.session?.isAuthenticated,
      products
    })
  } catch (error) {
    console.log(error)
  }
}

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const products = await Product.find()
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated: req.session?.isAuthenticated,
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
      isAuthenticated: req.session?.isAuthenticated,
      product
    })
  } catch (error) {
    console.log(error)
  }
}

export const getCart: RequestHandler = async (req, res) => {
  try {
    const userAndCart = await req.session!.user.populate('cart.items.productId').execPopulate()
    const cartProducts = userAndCart.cart.items
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
      isAuthenticated: req.session?.isAuthenticated,
      products: cartProducts
    })
  } catch (error) {
    console.log(error)
  }
}

export const postCart: RequestHandler = async (req, res) => {
  try {
    const productId = req.body.productId
    const product = await Product.findById(productId)
    await req.session?.user.addToCart(product!)
    res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

export const postCartDeleteProduct: RequestHandler = async (req, res) => {
  try {
    const productId = req.body.productId
    await req.session!.user.removeFromCart(productId)
    res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

export const postOrder: RequestHandler = async (req, res) => {
  try {
    const userAndCart = await req.session!.user.populate('cart.items.productId').execPopulate()
    const cartProducts = userAndCart.cart.items.map(cartProduct => {
      return {
        quantity: cartProduct.quantity,
        product: { ...cartProduct.productId._doc }
      }
    })

    const order = new Order({
      user: {
        name: req.session?.user.name,
        userId: req.session?.user._id
      },
      products: cartProducts
    })

    await order.save()
    await req.session?.user.clearCart()
    res.redirect('/orders')

  } catch (error) {
    console.log(error)
  }
}

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find({'user.userId': req.session?.user._id})
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      isAuthenticated: req.session!.isAuthenticated,
      orders
    })
  } catch (error) {
    console.log(error)
  }
}

export const getCheckout: RequestHandler = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: req.session!.isAuthenticated
  })
}