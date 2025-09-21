import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDb from '@/db/connectDb'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { amount, to_user, name, message } = await req.json()
    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    await connectDb()
    const recipient = await User.findOne({ username: to_user })
    const secret = recipient?.stripeSecretKey
    if (!secret) {
      return NextResponse.json({ error: 'Stripe not configured for this creator' }, { status: 400 })
    }

    const stripe = new Stripe(secret)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Support for ${to_user}`,
              description: message || 'Donation',
            },
            unit_amount: Math.round(Number(amount) * 100), // INR paise
          },
          quantity: 1,
        },
      ],
      metadata: { to_user, name: name || '', message: message || '' },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create Stripe session' }, { status: 500 })
  }
}