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
import { NewGig } from '../types/gig'

interface AddGigModalProps {
  onSave: (newGig: NewGig) => void
  isLoading: boolean
}

const AddGigModal: React.FC<AddGigModalProps> = ({ onSave, isLoading }) => {
  const [open, setOpen] = useState(false)
  const [newGig, setNewGig] = useState<NewGig>({
    date: '',
    employer: '',
    location: '',
    payment_amount: '',
    payment_date: '',
    payment_method: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewGig((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(newGig)
    setNewGig({
      date: '',
      employer: '',
      location: '',
      payment_amount: '',
      payment_date: '',
      payment_method: ''
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Add New Gig</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Gig</DialogTitle>
          <DialogDescription>
            Enter the details of the new gig here. Click save when you are done.
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
                value={newGig.date}
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
                value={newGig.employer}
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
                value={newGig.location}
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
                type='number'
                value={newGig.payment_amount}
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
                value={newGig.payment_date}
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
                value={newGig.payment_method}
                onChange={handleInputChange}
                className='col-span-3'
              />
            </div>
          </div>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save New Gig'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddGigModal
