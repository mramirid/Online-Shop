import express from 'express'

import * as adminController from '../controllers/admin'

const router = express.Router()

// GET /admin/products
router.get('/products', adminController.getProducts)

// GET /admin/add-product 
router.get('/add-product', adminController.getAddProduct)

// POST /admin/add-product 
router.post('/add-product', adminController.postAddProduct)

export default router