import {
  Optional,
  Model,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin
} from 'sequelize'

import sequelize from '../utils/database'
import Product from './Product'

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

  readonly createdAt!: Date | null
  readonly updatedAt!: Date | null

  getProducts!: HasManyGetAssociationsMixin<Product>
  createProduct!: HasManyCreateAssociationMixin<Product>
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
