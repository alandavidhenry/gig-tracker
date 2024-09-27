import mysql from 'mysql2/promise'
import local from 'next/font/local'
import { env } from 'process'

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MY_SQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default db
