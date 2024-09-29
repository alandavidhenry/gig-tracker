'use client'

import { useState } from 'react'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

interface EditGigModalProps {
  gig: Gig
  onSave: (updatedGig: Gig) => void
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

const EditGigModal: React.FC<EditGigModalProps> = ({ gig, onSave }) => {
  const [open, setOpen] = useState(false)
  const [editedGig, setEditedGig] = useState<NewGig>({
    date: formatDateForInput(gig.date),
    employer: gig.employer,
    location: gig.location,
    payment_amount: gig.payment_amount.toString(),
    payment_date: formatDateForInput(gig.payment_date),
    payment_method: gig.payment_method || ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedGig((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...gig,
      ...editedGig,
      date: formatDateForInput(editedGig.date),
      // date: new Date(editedGig.date).toISOString(),
      employer: editedGig.employer,
      location: editedGig.location,
      payment_amount: Number(editedGig.payment_amount),
      payment_date: editedGig.payment_date
        ? formatDateForInput(editedGig.payment_date)
        : null,
      payment_method: editedGig.payment_method || null
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Edit</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Gig</DialogTitle>
          <DialogDescription>
            Make changes to your gig here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='date' className='text-right'>
                Date
              </Label>
              <Input
                id='date'
                name='date'
                type='date'
                value={editedGig.date}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='employer' className='text-right'>
                Employer
              </Label>
              <Input
                id='employer'
                name='employer'
                value={editedGig.employer}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='location' className='text-right'>
                Location
              </Label>
              <Input
                id='location'
                name='location'
                value={editedGig.location}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='payment_amount' className='text-right'>
                Payment amount (£)
              </Label>
              <Input
                id='payment_amount'
                name='payment_amount'
                value={editedGig.payment_amount}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='payment_date' className='text-right'>
                Payment date
              </Label>
              <Input
                id='payment_date'
                name='payment_date'
                type='date'
                value={editedGig.payment_date}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='payment_method' className='text-right'>
                Payment method
              </Label>
              <Input
                id='payment_method'
                name='payment_method'
                value={editedGig.payment_method}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
          </div>
          <Button type='submit'>Save changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const GigTable: React.FC<{
  gigs: Gig[]
  onEdit: (gig: Gig) => void
  onDelete: (id: number) => void
}> = ({ gigs, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Employer</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Payment Amount</TableHead>
          <TableHead>Payment Date</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gigs.map((gig) => (
          <TableRow key={gig.id}>
            <TableCell>{new Date(gig.date).toLocaleDateString()}</TableCell>
            <TableCell>{gig.employer}</TableCell>
            <TableCell>{gig.location}</TableCell>
            <TableCell>£{gig.payment_amount}</TableCell>
            <TableCell>
              {gig.payment_date
                ? new Date(gig.payment_date).toLocaleDateString()
                : 'N/A'}
            </TableCell>
            <TableCell>{gig.payment_method || 'N/A'}</TableCell>
            <TableCell>
              <EditGigModal gig={gig} onSave={onEdit} />
              <Button variant='outline' onClick={() => onDelete(gig.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
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

  const handleEdit = async (updatedGig: Gig) => {
    try {
      console.log('Sending updated gig to server:', updatedGig)
      const res = await fetch('/api/gigs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGig)
      })

      if (res.ok) {
        mutate()
      } else {
        const errorData = await res.json()
        console.error('Server response:', errorData)
        throw new Error(`Failed to update gig: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Full error object:', error)
      setSubmitError('Failed to update gig. Please try again.')
      console.error('Update error:', error instanceof Error ? error.message : String(error))
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
      <GigTable gigs={data || []} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
