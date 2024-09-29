import React from 'react'
import { Button } from '@/components/ui/button'
import { NewGig } from '../types/gig'

interface AddGigFormProps {
  newGig: NewGig
  setNewGig: React.Dispatch<React.SetStateAction<NewGig>>
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const AddGigForm: React.FC<AddGigFormProps> = ({
  newGig,
  setNewGig,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className='mb-4'>
      <input
        type='date'
        placeholder='Date'
        value={newGig.date}
        onChange={(e) => setNewGig({ ...newGig, date: e.target.value })}
        className='border p-2 mr-2'
        required
      />
      {/* ... (other input fields) ... */}
      <Button type='submit'>Add Gig</Button>
    </form>
  )
}

export default AddGigForm
