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
import { Gig } from '../types/gig'
import EditGigModal from './EditGigModal'

interface GigTableProps {
  gigs: Gig[]
  onEdit: (gig: Gig) => void
  onDelete: (id: number) => void
}

const GigTable: React.FC<GigTableProps> = ({ gigs, onEdit, onDelete }) => {
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

export default GigTable
