import {
  Optional,
  Model,
  DataTypes
} from 'sequelize'

import sequelize from '../utils/database'

// For stricter typechecking
interface ProductAttributes {
  id: number
  title: string
  price: number
  imageUrl: string
  description: string
}

// Some fields are optional when calling UserModel.create() or UserModel.build()
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> { }

class Product extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes {
  id!: number
  title!: string
  price!: number
  imageUrl!: string
  description!: string

  readonly createdAt!: Date | null
  readonly updatedAt!: Date | null
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