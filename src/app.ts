import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import session from 'express-session'
import connectMongoDBSession from 'connect-mongodb-session'
import csrf from 'csurf'
import flash from 'connect-flash'

import activeDir from './utils/path'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import authRoutes from './routes/auth'
import * as errorController from './controllers/error'
import User, { IUser } from './models/User'

const app = express()

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

app.set('view engine', 'ejs')
app.set('views', 'dist/views')

app.use(express.static(path.join(activeDir, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'OBE8kj$xMA?xO6b*v$&KfdQmwPz?ah',
  resave: false,
  saveUninitialized: false,
  store: mongoDBStore
}))
app.use(csrf())
app.use(flash())

// Customize the express Session interface
declare global {
  namespace Express {
    export interface Session {
      user: IUser
      isAuthenticated: boolean
    }

    export interface Request {
      user: IUser
    }
  }
}

app.use(async (req, _, next) => {
  try {
    req.user = await User.findById(req.session?.user._id) as IUser
  } catch (_) {
    console.log(new Date().getMinutes(), 'req.user will be empty, because user is not authenticated')
  }
  next()
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session?.isAuthenticated
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.get404)

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(_ => {
    app.listen(3000)
  })
  .catch(error => {
    console.log(error)
  })