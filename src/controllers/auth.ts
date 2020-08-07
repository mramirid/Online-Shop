import { RequestHandler } from "express"

export const getLogin: RequestHandler = (req, res) => {
  console.log(req.cookies.isAuthenticated)
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.cookies.isAuthenticated,
  })
}

export const postLogin: RequestHandler = (req, res) => {
  res.setHeader('Set-Cookie', 'isAuthenticated=true')
  res.redirect('/')
}