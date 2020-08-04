import {
  Optional,
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

interface UserAttributes {
  id: number
  name: string
  email: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  id!: number
  name!: string
  email!: string

  readonly createdAt!: Date
  readonly updatedAt!: Date

  getProducts!: HasManyGetAssociationsMixin<Product>
  createProduct!: HasManyCreateAssociationMixin<Product>
  getCart!: HasOneGetAssociationMixin<Cart>
  createCart!: HasOneCreateAssociationMixin<Cart>
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
