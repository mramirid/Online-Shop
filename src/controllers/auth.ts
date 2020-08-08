import { RequestHandler } from "express"

import User, { IUser } from '../models/User'

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