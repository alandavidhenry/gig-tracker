import { Gig, NewGig } from '../types/gig'

export const fetcher = (url: string, init?: RequestInit) =>
  fetch(url, init).then((res) => {
    if (!res.ok) {
      throw new Error('An error occurred while fetching the data.')
    }
    return res.json()
  })

export const addGig = async (newGig: NewGig) => {
  const res = await fetch('/api/gigs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGig)
  })
  if (!res.ok) throw new Error('Failed to add gig')
  return res.json()
}

export const updateGig = async (updatedGig: Gig) => {
  const res = await fetch('/api/gigs', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedGig)
  })
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(
      `Failed to update gig: ${errorData.message || 'Unknown error'}`
    )
  }
  return res.json()
}

export const deleteGig = async (id: number) => {
  const res = await fetch('/api/gigs', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  if (!res.ok) throw new Error('Failed to delete gig')
  return res.json()
}
