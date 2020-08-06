import path from 'path'

import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import activeDir from './utils/path'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import * as errorController from './controllers/error'
import User, { IUser } from './models/User'

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'dist/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(activeDir, 'public')))

// Customize the express Request interface
declare global {
  namespace Express {
    export interface Request {
      user: IUser
    }
  }
}

app.use(async (req: Request, _: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      req.user = await User.findById('5f2bdf6027d8105fb885b695') as IUser
    }
    next()
  } catch (error) {
    console.log(error)
  }
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

dotenv.config()
const cluster = process.env.CLUSTER_NAME
const dbname = process.env.DB_NAME
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const url = `mongodb+srv://${username}:${password}@${cluster}.dxksd.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async _ => {
    const user = await User.findById('5f2bdf6027d8105fb885b695')
    if (!user) {
      const user = new User({
        name: 'Amir',
        email: 'amir@test.com',
        cart: {
          items: []
        }
      })
      await user.save()
    }
    app.listen(3000)
  })
  .catch(error => {
    console.log(error)
  })