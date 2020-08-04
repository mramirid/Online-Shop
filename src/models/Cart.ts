import {
  Optional,
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin
} from 'sequelize'

import sequelize from '../utils/database'
import Product from './Product'

interface CartAttributes {
  id: number
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'> { }

class Cart extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes {
  id!: number

  readonly createdAt!: Date
  readonly updatedAt!: Date

  getProducts!: HasManyGetAssociationsMixin<Product>
  addProduct!: HasManyAddAssociationMixin<Product, number>
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    tableName: 'carts',
    sequelize
  }
)

export default Cart
