import { RequestHandler } from "express"

import User, { IUser } from '../models/User'

export const getLogin: RequestHandler = (req, res) => {
  try {
    console.log()
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: req.session!.isAuthenticated
    })
  } catch (error) {
    console.log(error)
  }
}

export const postLogin: RequestHandler = async (req, res) => {
  try {
    req.session!.user = await User.findById('5f2bdf6027d8105fb885b695') as IUser
    req.session!.isAuthenticated = true
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}