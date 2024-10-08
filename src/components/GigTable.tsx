import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Gig } from '@/types/gig'
import EditGigModal from './EditGigModal'
import { formatDateForDisplay } from '@/lib/formatDate'

interface GigTableProps {
  gigsData: { success: boolean; data: Gig[] } | null | undefined
  onEdit: (gig: Gig) => void
  onDelete: (id: string) => void
  isLoading: boolean
}

const GigTable: React.FC<GigTableProps> = ({ gigsData, onEdit, onDelete, isLoading }) => {

  if (!gigsData) {
    return <div>No gigs data available.</div>
  }

  if (!gigsData.success) {
    return <div>Error: Failed to fetch gigs data.</div>
  }

  const gigs = gigsData.data

  if (!Array.isArray(gigs)) {
    console.error('Gigs data is not an array:', gigs)
    return <div>Error: Gigs data is in an unexpected format.</div>
  }

  if (gigs.length === 0) {
    return <div>No gigs found. Add a new gig to get started!</div>
  }

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
          <TableRow key={gig._id.toString()}>
            <TableCell>{formatDateForDisplay(gig.date)}</TableCell>
            <TableCell>{gig.employer}</TableCell>
            <TableCell>{gig.location}</TableCell>
            <TableCell>£{gig.payment_amount}</TableCell>
            <TableCell>{formatDateForDisplay(gig.payment_date)}</TableCell>
            <TableCell>{gig.payment_method || 'N/A'}</TableCell>
            <TableCell>
              <EditGigModal gig={gig} onSave={onEdit} />
              <Button
                variant='outline'
                onClick={() => onDelete(gig._id.toString())}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {isLoading && (
          <TableRow>
            <TableCell colSpan={7} className='text-center'>
              Loading...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default GigTable
