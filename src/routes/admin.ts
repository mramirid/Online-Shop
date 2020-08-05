import express from 'express'

import * as adminController from '../controllers/admin'

const router = express.Router()

/* ------------ Sub routes /admin/route_name ------------ */

router.get('/products', adminController.getProducts)

router.get('/add-product', adminController.getAddProduct)

router.post('/add-product', adminController.postAddProduct)

// router.get('/edit-product/:productId', adminController.getEditProduct)

// router.post('/edit-product', adminController.postEditProduct)

// router.post('/delete-product', adminController.postDeleteProduct)

export default router