import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'

import Product from '../models/Product'
import * as fileHelper from '../utils/file'

const ITEMS_PER_PAGE = 1

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const page = req.query.page ? +req.query.page : 1

    const [totalProducts, products] = await Promise.all([
      Product.find().countDocuments(),
      Product.find({ userId: req.user._id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    ])

    res.render('admin/product-list', {
      pageTitle: 'Admin Products',
      path: '/admin/products',
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
  const title = req.body.title
  const price = +req.body.price
  const image = req.file
  const description = req.body.description
  const userId = req.user._id

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      isEdit: false,
      hasError: true,
      errorMessage: 'Attached file is not an image',
      inputErrors: [],
      product: { title, price, description }
    })
  }

  const imageUrl = image.filename

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
      product: { title, price, imageUrl, description }
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
        description: req.body.description
      }
    })
  }

  try {
    const image = req.file
    const product = await Product.findById(req.body.productId)
    if (!product) throw 'No product found'

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/')
    }

    product.title = req.body.title
    product.price = req.body.price
    product.description = req.body.description
    if (image) {
      await fileHelper.deleteImage(product.imageUrl)
      product.imageUrl = image.filename
    }

    await product.save()
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
    const productId = req.body.productId
    const product = await Product.findById(productId)
    if (!product) throw 'No product found'

    await Promise.all([
      fileHelper.deleteImage(product.imageUrl),
      Product.deleteOne({ _id: productId, userId: req.user._id })
    ])

    console.log('Product deleted successfully')
    res.redirect('/admin/products')

  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}