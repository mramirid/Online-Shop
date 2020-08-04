import {
  Model,
  DataTypes
} from 'sequelize'

import sequelize from '../utils/database'

class Order extends Model {
  id!: number

  readonly createdAt!: Date
  readonly updatedAt!: Date
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
