
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      name, 
      email, 
      phone, 
      company, 
      projectType, 
      projectDetails, 
      budget, 
      timeline, 
      address 
    } = body

    // Validate required fields
    if (!name || !email || !projectType || !projectDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database
    const quoteRequest = await db.quoteRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        projectType,
        projectDetails,
        budget: budget || null,
        timeline: timeline || null,
        address: address || null
      }
    })

    return NextResponse.json(
      { 
        message: 'Quote request submitted successfully', 
        id: quoteRequest.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving quote request:', error)
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    )
  }
}
