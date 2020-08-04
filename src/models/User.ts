import {
  Model,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneCreateAssociationMixin
} from 'sequelize'

import sequelize from '../utils/database'
import Product from './Product'
import Cart from './Cart'
import Order from './Order'

class User extends Model {
  id!: number
  name!: string
  email!: string

  readonly createdAt!: Date
  readonly updatedAt!: Date

  createProduct!: HasManyCreateAssociationMixin<Product>
  getProducts!: HasManyGetAssociationsMixin<Product>
  createCart!: HasOneCreateAssociationMixin<Cart>
  getCart!: HasOneGetAssociationMixin<Cart>
  createOrder!: HasManyCreateAssociationMixin<Order>
  getOrders!: HasManyGetAssociationsMixin<Order>
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: DataTypes.STRING
  },
  {
    tableName: 'users',
    sequelize
  }
)

// Customize the express Request interface
declare global {
  namespace Express {
    export interface Request {
      user: User | null
    }
  }
}

export default User
