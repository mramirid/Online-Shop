import { RequestHandler } from "express"

import Product from '../models/Product'

export const getProducts: RequestHandler = async (_, res) => {
  try {
    const products = await Product.findAll()
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
    await Product.create({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      userId: req.user!.id
    })
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
    const product = await Product.findByPk(productId)

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
    const product = await Product.findByPk(req.body.productId)

    if (!product) throw new Error('Product not found')

    product.id = req.body.productId
    product.title = req.body.title
    product.imageUrl = req.body.imageUrl
    product.description = req.body.description
    product.price = req.body.price

    await product.save()
    console.log('Product updated successfully')
    res.redirect('/admin/products')
  } catch (error) {
    console.log(error)
  }
}

export const postDeleteProduct: RequestHandler = async (req, res) => {
  try {
    await Product.destroy({
      where: {
        id: req.body.productId
      }
    })
    console.log('Product deleted successfully')
    res.redirect('/admin/products')
  } catch (error) {
    console.log(error)
  }
}