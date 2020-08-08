import { RequestHandler } from "express"
import bcrypt, { hash } from 'bcryptjs'

import User, { IUser } from '../models/User'

export const getSignup: RequestHandler = (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuthenticated: false
  })
}

export const postSignup: RequestHandler = async (req, res) => {
  try {
    const email = req.body.email as string
    const password = req.body.password as string
    const confirmPassword = req.body.confirmPassword as string

    const user = await User.findOne({ email })
    if (user) return res.redirect('/signup')

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      email,
      password: hashedPassword,
      cart: { items: [] }
    })

    await newUser.save()
    res.redirect('/login')

  } catch (error) {
    console.log(error)
  }
}

export const getLogin: RequestHandler = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session?.isAuthenticated
  })
}

export const postLogin: RequestHandler = async (req, res) => {
  try {
    req.session!.user = await User.findById('5f2bdf6027d8105fb885b695') as IUser
    req.session!.isAuthenticated = true
    req.session!.save(error => {
      if (error) throw 'Failed to create session in the database'
      res.redirect('/')
    })
  } catch (error) {
    console.log(error)
  }
}

export const postLogout: RequestHandler = (req, res) => {
  req.session!.destroy(error => {
    if (error) console.log(error)
    res.redirect('/')
  })
}