import { Document, Types } from 'mongoose'

export interface GigData {
  _id: string | Types.ObjectId
  date: Date
  employer: string
  location: string
  payment_amount: number
  payment_date: Date | null
  payment_method: string | null
}

export interface Gig extends Omit<Document, '_id'>, GigData {}

export interface NewGig {
  date: string
  employer: string
  location: string
  payment_amount: string
  payment_date: string
  payment_method: string
}
