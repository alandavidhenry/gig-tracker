import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Gig from '@/models/Gig'

export async function GET() {
  await dbConnect()
  try {
    const gigs = await Gig.find({}).sort({ date: -1 })
    console.log('Fetched gigs:', gigs)
    return NextResponse.json({ success: true, data: gigs })
  } catch (error) {
    console.error('Error fetching gigs:', error)
    return NextResponse.json({ success: false }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  await dbConnect()
  try {
    const body = await request.json()
    const gig = await Gig.create(body)
    return NextResponse.json({ success: true, data: gig }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  await dbConnect()
  try {
    const body = await request.json()
    const gig = await Gig.findByIdAndUpdate(body._id, body, {
      new: true,
      runValidators: true
    })
    if (!gig) {
      return NextResponse.json({ success: false }, { status: 400 })
    }
    return NextResponse.json({ success: true, data: gig })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect()
  try {
    const { id } = await request.json()
    const deletedGig = await Gig.deleteOne({ _id: id })
    if (!deletedGig) {
      return NextResponse.json({ success: false }, { status: 400 })
    }
    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}