import express from 'express'

import * as productController from '../controllers/product'

const router = express.Router()

/*
 * GET /admin/add-product 
 */
router.get('/add-product', productController.getAddProduct)

/*
 * POST /admin/add-product 
 */
router.post('/add-product', productController.postAddProduct)

export default router