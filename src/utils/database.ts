import mysql from 'mysql2'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'online_shop',
  password: ''
})

export default pool.promise()