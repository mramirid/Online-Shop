import { Sequelize } from 'sequelize'

export default new Sequelize('online_shop', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
})