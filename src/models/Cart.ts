import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManySetAssociationsMixin
} from 'sequelize'

import sequelize from '../utils/database'
import Product from './Product'

class Cart extends Model {
  id!: number

  readonly createdAt!: Date
  readonly updatedAt!: Date

  getProducts!: HasManyGetAssociationsMixin<Product>
  addProduct!: HasManyAddAssociationMixin<Product, number>
  setProducts!: HasManySetAssociationsMixin<Product, number>
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
