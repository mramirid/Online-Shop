import { RequestHandler } from "express"

import Product from '../models/Product'

export const getProducts: RequestHandler = (_, res) => {
  Product.fetchAll(products => {
    res.render('admin/product-list', {
      pageTitle: 'Admin Products',
      path: '/admin/products',
      products
    })
  })
}

export const getAddProduct: RequestHandler = (_, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isEdit: false
  })
}

export const postAddProduct: RequestHandler = (req, res) => {
  const title: string = req.body.title
  const imageUrl: string = req.body.imageUrl
  const description: string = req.body.description
  const price: number = req.body.price

  const product = new Product(null, title, imageUrl, description, price)
  product.save()
  res.redirect('/')
}

export const getEditProduct: RequestHandler = (req, res) => {
  const editMode = req.query.edit

  if (!editMode) {
    return res.redirect('/')
  }

  const productId = req.params.productId
  Product.findById(productId, product => {
    if (!product) return res.redirect('/')

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      isEdit: true,
      product
    })
  })
}

export const postEditProduct: RequestHandler = (req, res) => {
  const updatedProduct = new Product(
    req.body.productId,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price,
  )
  updatedProduct.save()
  res.redirect('/admin/products')
}

export const postDeleteProduct: RequestHandler = (req, res) => {
  const productId = req.body.productId
  Product.deleteById(productId)
  res.redirect('/admin/products')
}