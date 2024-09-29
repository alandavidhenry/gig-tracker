'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Gig, NewGig } from '../types/gig'
import { fetcher, addGig, updateGig, deleteGig } from '../api/gigApi'
import GigTable from '../components/GigTable'
import AddGigModal from '@/components/AddGigModal'

export default function Home() {
  const { data, error, mutate } = useSWR<Gig[]>('/api/gigs', fetcher)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleAddGig = async (newGig: NewGig) => {
    setSubmitError(null)
    try {
      await addGig(newGig)
      mutate()
    } catch (error) {
      setSubmitError('Failed to add gig. Please try again.')
      console.error('Submit error:', error)
    }
  }

  const handleEdit = async (updatedGig: Gig) => {
    try {
      await updateGig(updatedGig)
      mutate()
    } catch (error) {
      setSubmitError('Failed to update gig. Please try again.')
      console.error('Update error:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteGig(id)
      mutate()
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
      <AddGigModal onSave={handleAddGig} />
      <GigTable gigs={data || []} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
