import crypto from 'crypto'

import { RequestHandler } from "express"
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import mailgunTransport from 'nodemailer-mailgun-transport'
import { validationResult } from 'express-validator'

import User from '../models/User'

dotenv.config()

const nodemailerMailgun = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: process.env.MAILGUN_KEY!,
      domain: process.env.MAILGUN_DOMAIN!
    }
  })
)

export const getSignup: RequestHandler = (req, res) => {
  let [message] = req.flash('error')
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message,
    inputErrors: [],
    oldInput: { email: '', password: '', confirmPassword: '' }
  })
}

export const postSignup: RequestHandler = async (req, res, next) => {
  const email: string = req.body.email
  const password: string = req.body.password
  const confirmPassword: string = req.body.confirmPassword

  const inputErrors = validationResult(req)
  const [firstInputError] = inputErrors.array()

  if (!inputErrors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: firstInputError.msg,
      inputErrors: inputErrors.array(),
      oldInput: { email, password, confirmPassword }
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      email,
      password: hashedPassword,
      cart: { items: [] }
    })
    await newUser.save()

    res.redirect('/login')

    nodemailerMailgun.sendMail({
      from: process.env.MAILGUN_SENDER,
      to: newUser.email,
      subject: 'Signup Success',
      html: '<h1>You successfully signed up</h1>'
    }).then(
      infoSended => {
        console.log('Reg email sended:', infoSended)
      },
      infoRejected => {
        console.log('Reg email: rejected:', infoRejected)
      }
    ).catch(error => {
      console.log('Cannot send reg email', error)
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const getLogin: RequestHandler = (req, res) => {
  let [message] = req.flash('error')
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
    inputErrors: [],
    oldInput: { email: '', password: '' }
  })
}

export const postLogin: RequestHandler = async (req, res, next) => {
  const email: string = req.body.email
  const password: string = req.body.password

  const inputErrors = validationResult(req)
  const [firstInputError] = inputErrors.array()

  if (!inputErrors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: firstInputError.msg,
      inputErrors: inputErrors.array(),
      oldInput: { email, password }
    })
  }

  try {
    let inputErrors: { param: string }[] = []

    const user = await User.findOne({ email })
    if (!user) inputErrors.push({ param: 'email' })

    const doMatch = await bcrypt.compare(password, user?.password || '')
    if (!doMatch) inputErrors.push({ param: 'password' })

    if (!user || !doMatch) {
      return res.status(422).render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: 'Invalid email or password',
        inputErrors,
        oldInput: { email, password }
      })
    }

    req.session!.user = user!
    req.session!.isAuthenticated = true
    req.session!.save(error => {
      if (error) throw 'Failed to create session in the database'
      res.redirect('/')
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const postLogout: RequestHandler = (req, res) => {
  req.session!.destroy(error => {
    if (error) console.log(error)
    res.redirect('/')
  })
}

export const getReset: RequestHandler = (req, res) => {
  let [message] = req.flash('error')
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: message
  })
}

export const postReset: RequestHandler = (req, res, next) => {
  crypto.randomBytes(32, async (error, buffer) => {
    if (error) {
      console.log(error)
      return res.redirect('/reset')
    }

    try {
      const token = buffer.toString('hex')
      const user = await User.findOne({ email: req.body.email })

      if (!user) {
        req.flash('error', 'No account with that email found')
        return res.redirect('/reset')
      }

      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 3_600_000
      await user.save()

      res.redirect('/')

      nodemailerMailgun.sendMail({
        from: process.env.MAILGUN_SENDER,
        to: user.email,
        subject: 'Password reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/new-password/${token}">link</a> to set a new password</p>
        `
      }).then(
        infoSended => {
          console.log('Reset pass email sended:', infoSended)
        },
        infoRejected => {
          console.log('Reset pass email rejected:', infoRejected)
        }
      ).catch(error => {
        console.log('Cannot send reset pass email', error)
      })
    } catch (error) {
      const operationError = new Error(error)
      operationError.httpStatusCode = 500
      next(operationError)
    }
  })
}

export const getNewPassword: RequestHandler = async (req, res, next) => {
  try {
    const token = req.params.token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    })

    let [message] = req.flash('error')
    res.render('auth/new-password', {
      pageTitle: 'New Password',
      path: '/new-password',
      errorMessage: message,
      userId: user?._id.toString(),
      passwordToken: token
    })
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}

export const postNewPassword: RequestHandler = async (req, res, next) => {
  try {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken

    const user = await User.findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() }
    })

    user!.password = await bcrypt.hash(newPassword, 12)
    user!.resetToken = undefined
    user!.resetTokenExpiration = undefined
    await user!.save()

    res.redirect('/login')

  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    next(operationError)
  }
}