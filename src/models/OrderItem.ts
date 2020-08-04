import {
  Model,
  DataTypes
} from 'sequelize'

import sequelize from '../utils/database'

class OrderItem extends Model {
  id!: number

  readonly createdAt!: Date
  readonly updatedAt!: Date
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    tableName: 'orderitems',
    sequelize
  }
)

export default OrderItem
