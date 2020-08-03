import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'

import activeDir from './utils/path'
import sequelize from './utils/database'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import * as errorController from './controllers/error'

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'dist/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(activeDir, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

sequelize.sync()
  .then(_ => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })