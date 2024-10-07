import { Gig, NewGig, GigData } from '@/types/gig'

export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const addGig = async (newGig: NewGig): Promise<Gig> => {
  const res = await fetch('/api/gigs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGig)
  })
  if (!res.ok) throw new Error('Failed to add gig')
  return res.json()
}

export const updateGig = async (updatedGig: GigData): Promise<Gig> => {
  const res = await fetch('/api/gigs', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedGig)
  })
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(`Failed to update gig: ${errorData.message || 'Unknown error'}`)
  }
  return res.json()
}

export const deleteGig = async (id: string): Promise<void> => {
  const res = await fetch('/api/gigs', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  if (!res.ok) throw new Error('Failed to delete gig')
}