import {
  Model,
  DataTypes
} from 'sequelize'

import sequelize from '../utils/database'

class CartItem extends Model {
  id!: number
  quantity!: number

  readonly createdAt!: Date
  readonly updatedAt!: Date
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    quantity: DataTypes.INTEGER
  },
  {
    tableName: 'cartitems',
    sequelize
  }
)

export default CartItem
