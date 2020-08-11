import { RequestHandler, ErrorRequestHandler } from "express"

export const get404: RequestHandler = (_, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404'
  })
}

export const serverErrorHandler: ErrorRequestHandler = (err, _, res, __) => {
  console.log(err.message)
  res.status(500).render('500', {
    pageTitle: 'Internal Server Error',
    path: '/500'
  })
}
