import express from 'express'
import { check, body } from 'express-validator'

import * as authController from '../controllers/auth'

const router = express.Router()

router.get('/signup', authController.getSignup)

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        if (value === 'test@test.com') {
          throw new Error('This email address is forbidden')
        }
        return true
      }),
    body('password', 'Enter password with only number or text & at least 5 characters')
      .isLength({ min: 5, max: 30 })
      .isAlphanumeric()
  ],
  authController.postSignup
)

router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/new-password/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

export default router