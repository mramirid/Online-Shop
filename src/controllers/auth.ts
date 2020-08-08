import { RequestHandler } from "express"

export const getLogin: RequestHandler = (req, res) => {
  console.log(req.session!.isLoggedIn)
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.cookies.isAuthenticated,
  })
}

export const postLogin: RequestHandler = (req, res) => {
  req.session!.isLoggedIn = true
  res.redirect('/')
}