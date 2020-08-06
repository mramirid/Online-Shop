import { RequestHandler } from 'express'

import Product from '../models/Product'

export const getProducts: RequestHandler = async (_, res) => {
  try {
    const products = await Product.find()
      .select('title price -_id')
      .populate('userId', 'name')

    console.log(products)

    res.render('admin/product-list', {
      pageTitle: 'Admin Products',
      path: '/admin/products',
      products
    })
  } catch (error) {
    console.log(error)
  }
}

export const getAddProduct: RequestHandler = (_, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
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

    await product!.save()
    console.log('Product updated successfully')
    res.redirect('/admin/products')

  } catch (error) {
    console.log(error)
  }
}

export const postDeleteProduct: RequestHandler = (req, res) => {
  Product.findByIdAndRemove(req.body.productId, (err) => {
    if (err) console.log(err)
    console.log('Product deleted successfully')
    res.redirect('/admin/products')
  })
}