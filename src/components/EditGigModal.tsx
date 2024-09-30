import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { Gig, NewGig } from '../types/gig'
import { formatDateForInput } from '@/lib/formatDate'

interface EditGigModalProps {
  gig: Gig
  onSave: (updatedGig: Gig) => void
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
      date: new Date(editedGig.date),
      employer: editedGig.employer,
      location: editedGig.location,
      payment_amount: Number(editedGig.payment_amount),
      payment_date: editedGig.payment_date ? new Date(editedGig.payment_date) : null,
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
                required
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
                required
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
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='payment_amount' className='text-right'>
                Payment amount (£)
              </Label>
              <Input
                id='payment_amount'
                name='payment_amount'
                type='number'
                value={editedGig.payment_amount}
                onChange={handleInputChange}
                className='col-span-3'
                required
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
                value={editedGig.payment_date || ''}
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
                value={editedGig.payment_method || ''}
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

export default EditGigModal