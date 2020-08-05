import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'

let db: Db

export const mongoConnect = async () => {
  try {
    dotenv.config()
    
    const cluster = process.env.CLUSTER_NAME
    const dbname = process.env.DB_NAME
    const username = process.env.DB_USERNAME
    const password = process.env.DB_PASSWORD
    
    const mongoClient = await MongoClient.connect(`mongodb+srv://${username}:${password}@${cluster}.dxksd.mongodb.net/${dbname}?retryWrites=true&w=majority`)
    db = mongoClient.db()
  } catch (error) {
    throw error
  }
}

export const getDb = () => {
  if (db) return db
  throw new Error('No database found')
}