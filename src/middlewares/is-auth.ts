import { RequestHandler } from "express"

const isAuth: RequestHandler = (req, res, next) => {
  if (!req.session?.isAuthenticated) {
    return res.redirect('/login')
  }
  next()
}

export default isAuth