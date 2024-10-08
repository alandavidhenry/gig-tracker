'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Gig, NewGig, GigData } from '@/types/gig'
import { fetcher, addGig, updateGig, deleteGig } from '@/api/gigApi'
import GigTable from '@/components/GigTable'
import AddGigModal from '@/components/AddGigModal'

export default function Home() {
  const { data, error, mutate } = useSWR<{ success: boolean; data: Gig[] }>(
    '/api/gigs',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddGig = async (newGig: NewGig) => {
    setSubmitError(null)
    setIsLoading(true)
    try {
      await addGig(newGig)
      await mutate()
    } catch (error) {
      setSubmitError('Failed to add gig. Please try again.')
      console.error('Submit error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (updatedGig: GigData) => {
    try {
      await updateGig(updatedGig)
      await mutate()
    } catch (error) {
      setSubmitError('Failed to update gig. Please try again.')
      console.error('Update error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteGig(id)
      await mutate()
    } catch (error) {
      setSubmitError('Failed to delete gig. Please try again.')
      console.error('Delete error:', error)
    }
  }

  if (error)
    return <div>Failed to load gigs data. Please try refreshing the page.</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gig Tracker</h1>
      {submitError && <div className='text-red-500 mb-4'>{submitError}</div>}
      <div className='mb-4'>
        <AddGigModal onSave={handleAddGig} isLoading={isLoading} />
      </div>
      <GigTable
        gigsData={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
