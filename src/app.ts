import path from 'path'

import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'

import activeDir from './utils/path'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import * as errorController from './controllers/error'
import sequelize from './utils/database'
import Product from './models/Product'
import User from './models/User'

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'dist/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(activeDir, 'public')))

app.use(async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(1)
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

// User -> Products
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)

// Setup dummy user (temp)
sequelize.sync()
  .then(_ => {
    return User.findByPk(1)
  })
  .then(dummyUser => {
    if (!dummyUser) {
      return User.create({ name: 'Amir', email: 'amir@test.com' })
    }
    return dummyUser
  })
  .then(dummyUser => {
    console.log(dummyUser)
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })