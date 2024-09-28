'use client'

import { useState } from 'react'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'

interface Gig {
  id: number
  date: string
  employer: string
  location: string
  payment_amount: number
  payment_date: string | null
  payment_method: string | null
}

interface NewGig {
  date: string
  employer: string
  location: string
  payment_amount: string
  payment_date: string
  payment_method: string
}

const fetcher = (url: string, init?: RequestInit) =>
  fetch(url, init).then((res) => {
    if (!res.ok) {
      throw new Error('An error occurred while fetching the data.')
    }
    return res.json()
  })

const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

export default function Home() {
  const { data, error, mutate } = useSWR<Gig[]>('/api/gigs', fetcher)
  const [newGig, setNewGig] = useState<NewGig>({
    date: '',
    employer: '',
    location: '',
    payment_amount: '0',
    payment_date: '',
    payment_method: ''
  })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [editingGig, setEditingGig] = useState<Gig | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    try {
      const gigToSubmit = {
        ...newGig,
        payment_amount: Number(newGig.payment_amount),
        payment_date: newGig.payment_date || null,
        payment_method: newGig.payment_method || null
      }
      const res = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gigToSubmit)
      })
      if (res.ok) {
        setNewGig({
          date: '',
          employer: '',
          location: '',
          payment_amount: '0',
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

  const handleEdit = (gig: Gig) => {
    setEditingGig({
      ...gig,
      date: formatDateForInput(gig.date),
      payment_date: formatDateForInput(gig.payment_date)
    })
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingGig) return

    try {
      const res = await fetch('/api/gigs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGig)
      })

      if (res.ok) {
        setEditingGig(null)
        mutate()
      } else {
        throw new Error('Failed to update gig')
      }
    } catch (error) {
      setSubmitError('Failed to update gig. Please try again.')
      console.error('Update error:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch('/api/gigs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        mutate()
      } else {
        throw new Error('Failed to delete gig')
      }
    } catch (error) {
      setSubmitError('Failed to delete gig. Please try again.')
      console.error('Delete error:', error)
    }
  }

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gig Tracker</h1>
      {submitError && <div className='text-red-500 mb-4'>{submitError}</div>}
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
        {data.map((gig: Gig) => (
          <li key={gig.id} className='mb-2'>
            {editingGig && editingGig.id === gig.id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type='date'
                  value={editingGig.date}
                  onChange={(e) =>
                    setEditingGig({ ...editingGig, date: e.target.value })
                  }
                  className='border p-2 mr-2'
                  required
                />
                <input
                  type='text'
                  value={editingGig.employer}
                  onChange={(e) =>
                    setEditingGig({ ...editingGig, employer: e.target.value })
                  }
                  className='border p-2 mr-2'
                  required
                />
                <input
                  type='text'
                  value={editingGig.location}
                  onChange={(e) =>
                    setEditingGig({ ...editingGig, location: e.target.value })
                  }
                  className='border p-2 mr-2'
                  required
                />
                <input
                  type='number'
                  value={editingGig.payment_amount}
                  onChange={(e) =>
                    setEditingGig({
                      ...editingGig,
                      payment_amount: Number(e.target.value)
                    })
                  }
                  className='border p-2 mr-2'
                  required
                />
                <input
                  type='date'
                  value={editingGig.payment_date || ''}
                  onChange={(e) =>
                    setEditingGig({
                      ...editingGig,
                      payment_date: e.target.value || null
                    })
                  }
                  className='border p-2 mr-2'
                  required
                />
                <input
                  type='text'
                  value={editingGig.payment_method || ''}
                  onChange={(e) =>
                    setEditingGig({
                      ...editingGig,
                      payment_method: e.target.value || null
                    })
                  }
                  className='border p-2 mr-2'
                  required
                />
                <Button type='submit'>Update</Button>
                <Button type='button' onClick={() => setEditingGig(null)}>
                  Cancel
                </Button>
              </form>
            ) : (
              <>
                {new Date(gig.date).toLocaleDateString()} - {gig.employer} -
                {gig.location} - £{gig.payment_amount} -
                {gig.payment_date
                  ? new Date(gig.payment_date).toLocaleDateString()
                  : 'N/A'}{' '}
                -{gig.payment_method ? gig.payment_method : 'N/A'}
                <Button onClick={() => handleEdit(gig)}>Edit Gig</Button>
                <Button onClick={() => handleDelete(gig.id)}>Delete Gig</Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
