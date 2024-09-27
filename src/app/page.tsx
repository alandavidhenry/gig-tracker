'use client'

import { useState } from 'react'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'

interface Gig {
  id: number
  date: Date
  employer: string
  location: string
  payment_amount: number
  payment_date: Date | null
  payment_method: string | null
}

const fetcher = (url: string, init?: RequestInit) =>
  fetch(url, init).then((res) => {
    if (!res.ok) {
      throw new Error('An error occurred while fetching the data.')
    }
    return res.json()
  })

export default function Home() {
  const { data, error, mutate } = useSWR<Gig[]>('/api/gigs', fetcher)
  const [newGig, setNewGig] = useState({
    date: '',
    employer: '',
    location: '',
    payment_amount: '',
    payment_date: '',
    payment_method: ''
  })
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    try {
      const res = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGig)
      })
      if (res.ok) {
        setNewGig({
          date: '',
          employer: '',
          location: '',
          payment_amount: '',
          payment_date: '',
          payment_method: ''
        })
        mutate()
      } else {
        throw new Error('Failed to add gig')
      }
    } catch (error) {
      setSubmitError('Failed to add gig. Please try again.')
      console.error('Submit error:', error)
    }
  }

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gig Tracker</h1>
      <form onSubmit={handleSubmit} className='mb-4'>
        <input
          type='date'
          placeholder='Date'
          value={newGig.date}
          onChange={(e) => setNewGig({ ...newGig, date: e.target.value })}
          className='border p-2 mr-2'
          required
        />
        <input
          type='text'
          placeholder='Employer'
          value={newGig.employer}
          onChange={(e) => setNewGig({ ...newGig, employer: e.target.value })}
          className='border p-2 mr-2'
          required
        />
        <input
          type='text'
          placeholder='Location'
          value={newGig.location}
          onChange={(e) => setNewGig({ ...newGig, location: e.target.value })}
          className='border p-2 mr-2'
          required
        />
        <input
          type='number'
          placeholder='Payment amount'
          value={newGig.payment_amount}
          onChange={(e) =>
            setNewGig({ ...newGig, payment_amount: e.target.value })
          }
          className='border p-2 mr-2'
          required
        />
        <input
          type='date'
          placeholder='Payment date'
          value={newGig.payment_date}
          onChange={(e) =>
            setNewGig({ ...newGig, payment_date: e.target.value })
          }
          className='border p-2 mr-2'
        />
        <input
          type='text'
          placeholder='Payment method'
          value={newGig.payment_method}
          onChange={(e) =>
            setNewGig({ ...newGig, payment_method: e.target.value })
          }
          className='border p-2 mr-2'
        />
        <Button type='submit'>Add Gig</Button>
      </form>
      <ul>
        {data.map((gig: any) => (
          <li key={gig.id} className='mb-2'>
            {new Date(gig.date).toLocaleDateString()} - {gig.employer}{' '}
            {gig.location} - £{gig.payment_amount} -{' '}
            {new Date(gig.payment_date).toLocaleDateString()} -{' '}
            {gig.payment_method}
            <Button>Edit Gig</Button>
            <Button>Delete Gig</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
