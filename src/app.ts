import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import session from 'express-session'
import connectMongoDBSession from 'connect-mongodb-session'
import csrf from 'csurf'
import flash from 'connect-flash'
import { v4 as uuidv4 } from 'uuid'
import helmet from 'helmet'

import activeDir from './utils/path'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import authRoutes from './routes/auth'
import * as errorController from './controllers/error'
import User, { IUser } from './models/User'

/* --- Customize built-in interfaces --- */
declare global {
  export interface Error { httpStatusCode: number }

  namespace Express {
    export interface Request { user: IUser }
    export interface Session { user: IUser; isAuthenticated: boolean }
  }
}

/* --- Setup MongoDB connection --- */
dotenv.config()
const cluster = process.env.CLUSTER_NAME
const dbname = process.env.DB_NAME
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const MONGODB_URL = `mongodb+srv://${username}:${password}@${cluster}.dxksd.mongodb.net/${dbname}?retryWrites=true&w=majority`

const MongoDBStore = connectMongoDBSession(session)
const mongoDBStore = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
})

/* --- Setup express extensions & helper middlewares --- */
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'dist/views')

app.use(express.static(path.join(activeDir, 'public')))
app.use(express.static(path.join(activeDir, 'data', 'images')))

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({
  storage: multer.diskStorage({
    destination: (_, __, callback) => {
      callback(null, 'dist/data/images')
    },
    filename: (_, file, callback) => {
      callback(null, `${uuidv4()}-${file.originalname}`)
    }
  }),
  fileFilter: (_, file, callback) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  }
}).single('image'))

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: mongoDBStore
}))

app.use(csrf())

app.use(flash())

/* --- Setup our middlewares --- */
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session?.isAuthenticated
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(async (req, _, next) => {
  if (!req.session?.user) return next()

  try {
    const user = await User.findById(req.session.user._id) as IUser
    if (!user) throw 'User not found in the database'
    req.user = user
  } catch (error) {
    const operationError = new Error(error)
    operationError.httpStatusCode = 500
    return next(operationError)
  }

  next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.get404)
app.use(errorController.serverErrorHandler)

/* --- Start server after MongoDB connection is established --- */
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(_ => {
  app.listen(process.env.PORT || 3000)
}).catch(error => {
  console.log('MongoDB connection failed:', error)
})