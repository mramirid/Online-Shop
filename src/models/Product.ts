import { Optional, Model, DataTypes } from 'sequelize'

import sequelize from '../utils/database'

// For stricter typechecking
interface ProductAttributes {
  id: number
  title: string
  price: number
  imageUrl: string
  description: string,
  createdAt?: Date,
  updatedAt?: Date,
  userId: number
}

// Some fields are optional when calling UserModel.create() or UserModel.build()
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> { }

// We need to declare an interface for our model that is basically what our class would be
interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes { }

export default sequelize.define<ProductInstance>('product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})