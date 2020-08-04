import {
  Model,
  DataTypes,
  HasManyAddAssociationMixin
} from 'sequelize'

import sequelize from '../utils/database'
import Product from './Product'

class Order extends Model {
  id!: number

  readonly createdAt!: Date
  readonly updatedAt!: Date

  addProducts!: HasManyAddAssociationMixin<Product[], number>
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    tableName: 'orders',
    sequelize
  }
)

export default Order
