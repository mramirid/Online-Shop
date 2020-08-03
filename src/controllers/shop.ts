import { RequestHandler } from 'express'

import Product from '../models/Product'
import Cart from '../models/Cart'

export const getProducts: RequestHandler = async (_, res) => {
  try {
    const products = await Product.findAll()
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
    const [[product]] = await Product.findById(productId)
    console.log(product)
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
    const products = await Product.findAll()
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      products
    })
  } catch (error) {
    console.log(error)
  }
}

export const getCart: RequestHandler = (_, res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = []

      for (const product of products) {
        const cartProductData = cart?.products.find(cartProduct => cartProduct.id === product.id)
        if (cartProductData) {
          cartProducts.push({ product, qty: cartProductData.qty })
        }
      }

      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        cartProducts
      })
    })
  })
}

export const postCart: RequestHandler = (req, res) => {
  const productId = req.body.productId
  Product.findById(productId, (product => {
    Cart.addProduct(productId, product.price)
    res.redirect('/cart')
  }))
}

export const postCartDeleteProduct: RequestHandler = (req, res) => {
  const productId = req.body.productId
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price)
    res.redirect('/cart')
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