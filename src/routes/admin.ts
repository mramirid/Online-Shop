import express from 'express'
import { body } from 'express-validator'

import * as adminController from '../controllers/admin'
import isAuth from '../middlewares/is-auth'

const router = express.Router()

/* ------------ Sub routes /admin/route_name ------------ */

router.get('/products', isAuth, adminController.getProducts)

router.get('/add-product', isAuth, adminController.getAddProduct)

router.post('/add-product',
  [
    body('title')
      .trim()
      .isString()
      .isLength({ min: 3, max: 50 }),
    body('price')
      .trim()
      .isFloat(),
    body('description')
      .trim()
      .isLength({ min: 5, max: 400 })
  ],
  isAuth, adminController.postAddProduct
)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product',
  [
    body('title')
      .trim()
      .isString()
      .isLength({ min: 3, max: 50 }),
    body('price')
      .trim()
      .isFloat(),
    body('description')
      .trim()
      .isLength({ min: 5, max: 400 })
  ],
  isAuth, adminController.postEditProduct
)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

export default router