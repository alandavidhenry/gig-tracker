import { NextResponse } from 'next/server'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import db from '@/lib/db'

interface Gig extends RowDataPacket {
  id: number
  date: string
  employer: string
  location: string
  payment_amount: number
  payment_date: string | null
  payment_method: string | null
}

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM gigs')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching gigs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const {
      date,
      employer,
      location,
      payment_amount,
      payment_date,
      payment_method
    } = await request.json()

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO gigs (date, employer, location, payment_amount, payment_date, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
      [date, employer, location, payment_amount, payment_date, payment_method]
    )
    return NextResponse.json(
      {
        id: result.insertId,
        date,
        employer,
        location,
        payment_amount,
        payment_date,
        payment_method
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating a gig' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const {
      id,
      date,
      employer,
      location,
      payment_amount,
      payment_date,
      payment_method
    } = await request.json()

    const [result] = await db.query<ResultSetHeader>(
      'UPDATE gigs SET date = ?, employer = ?, location = ?, payment_amount = ?, payment_date = ?, payment_method = ? WHERE id = ?',
      [
        date,
        employer,
        location,
        payment_amount,
        payment_date,
        payment_method,
        id
      ]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Gig updated successfully' })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating the gig' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM gigs WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Gig deleted successfully' })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the gig' },
      { status: 500 }
    )
  }
}
