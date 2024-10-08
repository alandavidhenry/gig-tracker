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
import { ArrowUpIcon } from 'lucide-react'

interface GigTableProps {
  gigsData: { success: boolean; data: Gig[] } | null | undefined
  onEdit: (gig: Gig) => void
  onDelete: (id: string) => void
  isLoading: boolean
}

interface GroupedGigs {
  [key: string]: Gig[]
}

const GigTable: React.FC<GigTableProps> = ({
  gigsData,
  onEdit,
  onDelete,
  isLoading
}) => {
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

  const groupGigsByMonth = (gigs: Gig[]): GroupedGigs => {
    return gigs.reduce((acc: GroupedGigs, gig: Gig) => {
      const date = new Date(gig.date)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(gig)
      return acc
    }, {})
  }

  const groupedGigs = groupGigsByMonth(gigs)

  const calculateTotalEarned = (gigs: Gig[]): number => {
    return gigs.reduce((total, gig) => total + gig.payment_amount, 0)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            Date <ArrowUpIcon className='inline-block w-4 h-4 ml-1' />
          </TableHead>
          <TableHead>Employer</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Payment Amount</TableHead>
          <TableHead>Payment Date</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(groupedGigs).map(([monthYear, monthGigs]) => (
          <React.Fragment key={monthYear}>
            <TableRow className='bg-muted'>
              <TableCell colSpan={7} className='font-bold'>
                {new Date(monthYear).toLocaleString('default', {
                  month: 'long',
                  year: 'numeric'
                })}
              </TableCell>
            </TableRow>
            {monthGigs.map((gig) => (
              <TableRow key={gig._id.toString()}>
                <TableCell>{formatDateForDisplay(gig.date)}</TableCell>
                <TableCell>{gig.employer}</TableCell>
                <TableCell>{gig.location}</TableCell>
                <TableCell>£{gig.payment_amount.toFixed(2)}</TableCell>
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
            <TableRow className='bg-muted'>
              <TableCell colSpan={3} className='font-bold text-right'>
                Total Earned:
              </TableCell>
              <TableCell className='font-bold'>
                £{calculateTotalEarned(monthGigs).toFixed(2)}
              </TableCell>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
          </React.Fragment>
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
