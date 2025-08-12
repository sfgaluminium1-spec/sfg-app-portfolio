
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
      serviceType, 
      productType, 
      description, 
      urgency, 
      preferredDate, 
      address 
    } = body

    // Validate required fields
    if (!name || !email || !serviceType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database
    const serviceInquiry = await db.serviceInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        serviceType,
        productType: productType || null,
        description,
        urgency: urgency || 'normal',
        preferredDate: preferredDate || null,
        address: address || null
      }
    })

    return NextResponse.json(
      { 
        message: 'Service inquiry submitted successfully', 
        id: serviceInquiry.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving service inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit service inquiry' },
      { status: 500 }
    )
  }
}
