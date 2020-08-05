import { getDb } from '../utils/database'

export default class Product {
  constructor(
    public title: string,
    public price: number,
    public imageUrl: string,
    public description: string
  ) { }

  save() {

  }
}

// class Product extends Model {
  

//   readonly createdAt!: Date
//   readonly updatedAt!: Date

//   [x: string]: any
// }

// Product.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     price: {
//       type: DataTypes.DOUBLE,
//       allowNull: false
//     },
//     imageUrl: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   },
//   {
//     tableName: 'products',
//     sequelize
//   }
// )