import path from 'path'

import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'

import activeDir from './utils/path'
import adminRoutes from './routes/admin'
// import shopRoutes from './routes/shop'
import * as errorController from './controllers/error'
import { mongoConnect } from './utils/database'

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'dist/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(activeDir, 'public')))

app.use(async (req: Request, _: Response, next: NextFunction) => {
  // try {
  //   const user = await User.findByPk(1)
  //   req.user = user
  //   next()
  // } catch (error) {
  //   console.log(error)
  // }
  next()
})

app.use('/admin', adminRoutes)
// app.use(shopRoutes)
app.use(errorController.get404)

mongoConnect()
  .then(() => {
    app.listen(3000)
  })
  .catch(error => {
    console.log(error)
  })
