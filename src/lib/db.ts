import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: MongooseCache | undefined
    }
  }
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: MongooseCache | undefined
}

const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null }

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
