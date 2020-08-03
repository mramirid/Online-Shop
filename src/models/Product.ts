import { Optional, Model, DataTypes } from 'sequelize'

import sequelize from '../utils/database'

interface ProductAttributes {
  id: string
  title: string
  price: number
  imageUrl: string
  description: string
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> { }

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
  }
})