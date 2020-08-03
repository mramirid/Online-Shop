import { Optional, Model, DataTypes } from 'sequelize'

import sequelize from '../utils/database'

interface UserAttributes {
  id: number
  name: string
  email: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes { }

export default sequelize.define<UserInstance>('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: DataTypes.STRING
})

// Customize the express Request interface
declare global {
  namespace Express {
    export interface Request {
      user: UserInstance | null
    }
  }
}