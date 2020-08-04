import {
  Model,
  DataTypes
} from 'sequelize'

import sequelize from '../utils/database'

class Product extends Model {  
  id!: number
  title!: string
  price!: number
  imageUrl!: string
  description!: string

  readonly createdAt!: Date
  readonly updatedAt!: Date

  [x: string]: any
}

Product.init(
  {
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
  },
  {
    tableName: 'products',
    sequelize
  }
)

export default Product