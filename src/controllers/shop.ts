import fs from 'fs'
import path from 'path'

import { RequestHandler } from 'express'
import PDFDocument from 'pdfkit'
import Stripe from 'stripe'

import Product from '../models/Product'
import Order, { IOrder } from '../models/Order'
import activeDir from '../utils/path'

const ITEMS_PER_PAGE = 3

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2020-03-02' })

export const getIndex: RequestHandler = async (req, res, next) => {
  try {
    const page = req.query.page ? +req.query.page : 1

    const [totalProducts, products] = await Promise.all([
      Product.find().countDocuments(),
      Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    ])

    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      products,
      hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      curPage: page,
      lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE)
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const page = req.query.page ? +req.query.page : 1

    const [totalProducts, products] = await Promise.all([
      Product.find().countDocuments(),
      Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    ])

    res.render('shop/product-list', {
      pageTitle: 'Products',
      path: '/products',
      products,
      hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      curPage: page,
      lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE)
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

export const getCheckout: RequestHandler = async (req, res, next) => {
  try {
    const userAndCart = await req.user.populate('cart.items.productId').execPopulate()
    const cartProducts = userAndCart.cart.items
    const totalPrice = cartProducts.reduce((total, cartProduct) => {
      return total + (cartProduct.quantity * cartProduct.productId.price)
    }, 0)

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartProducts.map(cartProduct => {
        return {
          name: cartProduct.productId.title,
          description: cartProduct.productId.description,
          amount: cartProduct.productId.price * 100,
          currency: 'usd',
          quantity: cartProduct.quantity
        }
      }),
      success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`
    })

    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      products: cartProducts,
      totalPrice,
      stripeSessionId: stripeSession.id
    })

  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getCheckoutSuccess: RequestHandler = async (req, res, next) => {
  try {
    const userAndCart = await req.user.populate('cart.items.productId').execPopulate()
    const cartProducts = userAndCart.cart.items.map(cartProduct => {
      return {
        quantity: cartProduct.quantity,
        product: cartProduct.productId.toObject()
      }
    })

    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user._id
      },
      products: cartProducts
    })

    await Promise.all([order.save(), req.user.clearCart()])
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

export const getInvoice: RequestHandler = async (req, res, next) => {
  const orderId = req.params.orderId
  let order: IOrder | null
  try {
    order = await Order.findById(orderId)
    if (!order) throw { statusCode: 404, message: 'No order found' }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      throw { statusCode: 401, message: 'Unauthorized' }
    }
  } catch (error) {
    const operationError = new Error(error.message)
    operationError.httpStatusCode = error.statusCode
    return next(operationError)
  }

  const invoiceName = `invoice-${orderId}.pdf`
  const invoicePath = path.join(activeDir, 'data', 'invoices', invoiceName)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`)

  const pdfDoc = new PDFDocument()
  pdfDoc.pipe(fs.createWriteStream(invoicePath))
  pdfDoc.pipe(res)

  pdfDoc.fontSize(26).text('Invoice', { underline: true })
  pdfDoc.text('------------------------------------------------------')
  let totalPrice = 0
  order.products.forEach(orderProduct => {
    pdfDoc.fontSize(16).text(`${orderProduct.product.title}, price: (${orderProduct.quantity} x $${orderProduct.product.price})`)
    totalPrice += (orderProduct.quantity * orderProduct.product.price)
  })
  pdfDoc.fontSize(26).text('------------------------------------------------------')
  pdfDoc.fontSize(18).text(`Total price: $${totalPrice}`)
  pdfDoc.end()

  const file = fs.createReadStream(invoicePath)

  file.pipe(res)
}