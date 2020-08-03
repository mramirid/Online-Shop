import path from 'path'

import express from 'express'
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

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

// Users <-> Products
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)

sequelize.sync({ force: true })
  .then(_ => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })