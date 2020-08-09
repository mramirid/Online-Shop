import express from 'express'

import * as adminController from '../controllers/admin'
import isAuth from '../middlewares/is-auth'

const router = express.Router()

/* ------------ Sub routes /admin/route_name ------------ */

router.get('/products', isAuth, adminController.getProducts)

router.get('/add-product', isAuth, adminController.getAddProduct)

router.post('/add-product', isAuth, adminController.postAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product', isAuth, adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

export default router