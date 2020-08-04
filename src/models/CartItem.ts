import {
  Model,
  DataTypes
} from 'sequelize'

import sequelize from '../utils/database'

interface CartItemAttributes {
  id: number
  quantity: number
}

class CartItem extends Model implements CartItemAttributes {
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
    tableName: 'cartItems',
    sequelize
  }
)

export default CartItem
