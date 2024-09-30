import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MY_SQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(process.env.NODE_ENV === 'production'
    ? {
        ssl: {
          rejectUnauthorized: true,
          ca: process.env.MYSQL_SSL_CA
        }
      }
    : {})
})

export default db

