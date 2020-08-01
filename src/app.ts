import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'

import currDir from './utils/path'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import * as errorController from './controllers/error'

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'dist/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(currDir, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

app.listen(3000)