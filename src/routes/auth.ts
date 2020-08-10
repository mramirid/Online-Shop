import express from 'express'
import { check, body } from 'express-validator'

import User from '../models/User'
import * as authController from '../controllers/auth'

const router = express.Router()

router.get('/signup', authController.getSignup)

router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Enter a valid email')
      .custom(async value => {
        const user = await User.findOne({ email: value })
        if (user) throw new Error('The email is already used')
      }),
    body('password', 'Enter password with only number or text & at least 5 characters')
      .isLength({ min: 5, max: 30 })
      .isAlphanumeric(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password have to match!')
        }
        return true
      })
  ],
  authController.postSignup
)

router.get('/login', authController.getLogin)

router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('Enter a valid email'),
    body('password', 'Enter your password with only number or text & at least 5 characters')
      .isLength({ min: 5, max: 30 })
      .isAlphanumeric()
  ],
  authController.postLogin
)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/new-password/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

export default router