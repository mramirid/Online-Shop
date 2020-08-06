import path from 'path'

import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import activeDir from './utils/path'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import * as errorController from './controllers/error'

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'dist/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(activeDir, 'public')))

// Customize the express Request interface
// declare global {
//   namespace Express {
//     export interface Request {
//       user: User | null
//     }
//   }
// }

// app.use(async (req: Request, _: Response, next: NextFunction) => {
//   try {
//     if (!req.user) {
//       const user = await User.findById('5f2ab58bfbe166ef8c39e2c2') as User
//       req.user = new User(user.name, user.email, user.cart, user._id)
//     }
//     next()
//   } catch (error) {
//     console.log(error)
//   }
// })

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

dotenv.config()
const cluster = process.env.CLUSTER_NAME
const dbname = process.env.DB_NAME
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.dxksd.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
).then(_ => {
  app.listen(3000)
}).catch(error => {
  console.log(error)
})