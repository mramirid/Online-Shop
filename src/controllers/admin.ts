import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'

import Product from '../models/Product'

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id })
    res.render('admin/product-list', {
      pageTitle: 'Admin Products',
      path: '/admin/products',
      products
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getAddProduct: RequestHandler = (_, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isEdit: false,
    hasError: false,
    errorMessage: null,
    inputErrors: [],
  })
}

export const postAddProduct: RequestHandler = async (req, res, next) => {
  const title: string = req.body.title
  const price = +req.body.price
  const imageUrl: string = req.body.imageUrl
  const description: string = req.body.description
  const userId = req.user._id

  const inputErrors = validationResult(req)
  const [firstInputError] = inputErrors.array()

  if (!inputErrors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      isEdit: false,
      hasError: true,
      errorMessage: firstInputError.msg,
      inputErrors: inputErrors.array(),
      product: { title, price, imageUrl, description, userId }
    })
  }

  try {
    const product = new Product({ title, price, imageUrl, description, userId })
    await product.save()
    console.log('Product created successfully')
    res.redirect('/admin/products')
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getEditProduct: RequestHandler = async (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) return res.redirect('/')

  try {
    const product = await Product.findById(req.params.productId)
    if (!product) return res.redirect('/')
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      isEdit: true,
      hasError: false,
      errorMessage: null,
      inputErrors: [],
      product
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const postEditProduct: RequestHandler = async (req, res, next) => {
  const inputErrors = validationResult(req)
  const [firstInputError] = inputErrors.array()

  if (!inputErrors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      isEdit: true,
      hasError: true,
      errorMessage: firstInputError.msg,
      inputErrors: inputErrors.array(),
      product: {
        _id: req.body.productId,
        title: req.body.title,
        price: +req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description
      }
    })
  }

  try {
    const product = await Product.findById(req.body.productId)

    if (product?.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/')
    }

    product!.title = req.body.title
    product!.price = req.body.price
    product!.imageUrl = req.body.imageUrl
    product!.description = req.body.description

    await product!.save()
    console.log('Product updated successfully')
    res.redirect('/admin/products')

  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const postDeleteProduct: RequestHandler = async (req, res, next) => {
  try {
    await Product.deleteOne({
      _id: req.body.productId,
      userId: req.user._id
    })
    console.log('Product deleted successfully')
    res.redirect('/admin/products')
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}