export interface Gig {
  id: number
  date: string
  employer: string
  location: string
  payment_amount: number
  payment_date: string | null
  payment_method: string | null
}

export interface NewGig {
  date: string
  employer: string
  location: string
  payment_amount: string
  payment_date: string
  payment_method: string
}
