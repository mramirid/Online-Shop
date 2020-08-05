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
    const product = await Product.findById(productId) as Product
    res.render('shop/product-detail', {
      pageTitle: product.title,
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
    const cart = await req.user!.getCart()
    const products = await cart.getProducts()

    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
      products
    })
  } catch (error) {
    console.log(error)
  }
}

export const postCart: RequestHandler = async (req, res) => {
  try {
    const productId = req.body.productId
    const cart = await req.user!.getCart()
    let [product] = await cart.getProducts({ where: { id: productId }, limit: 1 })
    let newQuantity = 1

    if (product) {
      const oldQuantity = product.CartItem.quantity
      newQuantity = oldQuantity + 1
      await cart.addProduct(product, { through: { quantity: newQuantity } })
    } else {
      product = await Product.findByPk(productId) as Product
      await cart.addProduct(product, { through: { quantity: newQuantity } })
    }

    res.redirect('/cart')

  } catch (error) {
    console.log(error)
  }
}

export const postCartDeleteProduct: RequestHandler = async (req, res) => {
  try {
    const productId = req.body.productId
    const cart = await req.user!.getCart()
    const [product] = await cart.getProducts({ where: { id: productId }, limit: 1 })

    await product.CartItem.destroy()
    res.redirect('/cart')

  } catch (error) {
    console.log(error)
  }
}

export const postOrder: RequestHandler = async (req, res) => {
  try {
    const cart = await req.user!.getCart()
    const products = await cart.getProducts()

    const order = await req.user!.createOrder()
    await order.addProducts(products.map(product => {
      product.OrderItem = { quantity: product.CartItem.quantity }
      return product
    }))

    await cart.setProducts(undefined) // Clear cart
    res.redirect('/orders')

  } catch (error) {
    console.log(error)
  }
}

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await req.user!.getOrders({ include: ['Products'] })
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