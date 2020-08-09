import { RequestHandler } from "express"
import bcrypt from 'bcryptjs'

import User from '../models/User'

export const getSignup: RequestHandler = (req, res) => {
  let [message] = req.flash('error')
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message
  })
}

export const postSignup: RequestHandler = async (req, res) => {
  try {
    const email = req.body.email as string
    const password = req.body.password as string
    const _ = req.body.confirmPassword as string

    const user = await User.findOne({ email })
    if (user) throw 'The email is already used'

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      email,
      password: hashedPassword,
      cart: { items: [] }
    })

    await newUser.save()
    res.redirect('/login')

  } catch (error) {
    req.flash('error', error)
    res.redirect('/signup')
  }
}

export const getLogin: RequestHandler = (req, res) => {
  let [message] = req.flash('error')
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message
  })
}

export const postLogin: RequestHandler = async (req, res) => {
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