import { RequestHandler } from 'express'

import Product from '../models/Product'

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const products = await Product.find()
    res.render('admin/product-list', {
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.isAuthenticated,
      products
    })
  } catch (error) {
    console.log(error)
  }
}

export const getAddProduct: RequestHandler = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isAuthenticated: req.isAuthenticated,
    isEdit: false
  })
}

export const postAddProduct: RequestHandler = async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      price: +req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      userId: req.user._id
    })

    await product.save()
    console.log('Product created successfully')
    res.redirect('/admin/products')

  } catch (error) {
    console.log(error)
  }
}

export const getEditProduct: RequestHandler = async (req, res) => {
  const editMode = req.query.edit
  if (!editMode) return res.redirect('/')

  try {
    const productId = req.params.productId
    const product = await Product.findById(productId)

    if (!product) return res.redirect('/')

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      isAuthenticated: req.isAuthenticated,
      isEdit: true,
      product
    })
  } catch (error) {
    console.log(error)
  }
}

export const postEditProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId)

    if (!product) return res.redirect('/')

    product.title = req.body.title
    product.price = req.body.price
    product.imageUrl = req.body.imageUrl
    product.description = req.body.description

    await product.save()
    console.log('Product updated successfully')
    res.redirect('/admin/products')

  } catch (error) {
    console.log(error)
  }
}

export const postDeleteProduct: RequestHandler = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.body.productId)
    console.log('Product deleted successfully')
    res.redirect('/admin/products')
  } catch (error) {
    console.log(error)
  }
}