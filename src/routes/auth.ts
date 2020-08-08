import express from 'express'

import * as authController from '../controllers/auth'

const router = express.Router()

router.get('/signup', authController.getSignup)

router.post('/signup', authController.postSignup)

router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.post('/logout', authController.postLogout)

export default router