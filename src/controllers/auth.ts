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
    validationErrors: [],
    oldInput: { email: '', password: '', confirmPassword: '' }
  })
}

export const postSignup: RequestHandler = async (req, res) => {
  const errors = validationResult(req)
  const [firstError] = errors.array()

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: firstError.msg,
      validationErrors: errors.array(),
      oldInput: {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      }
    })
  }

  try {
    const email = req.body.email as string
    const password = req.body.password as string

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
    console.log(error)
  }
}

export const getLogin: RequestHandler = (req, res) => {
  let [message] = req.flash('error')
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
    validationErrors: [],
    oldInput: { email: '', password: '' }
  })
}

export const postLogin: RequestHandler = async (req, res) => {
  const errors = validationResult(req)
  const [firstError] = errors.array()

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: firstError.msg,
      validationErrors: errors.array(),
      oldInput: {
        email: req.body.email,
        password: req.body.password
      }
    })
  }

  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) throw 'Invalid email or password'

    const doMatch = await bcrypt.compare(req.body.password, user.password)
    if (!doMatch) throw 'Invalid email or password'

    req.session!.user = user
    req.session!.isAuthenticated = true
    req.session!.save(error => {
      if (error) throw 'Failed to create session in the database'
      res.redirect('/')
    })

  } catch (error) {
    req.flash('error', error)
    res.redirect('/login')
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

export const postReset: RequestHandler = (req, res) => {
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
      console.log(error)
    }
  })
}

export const getNewPassword: RequestHandler = async (req, res) => {
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
    console.log(error)
  }
}

export const postNewPassword: RequestHandler = async (req, res) => {
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
    console.log(error)
  }
}