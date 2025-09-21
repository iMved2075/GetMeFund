import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDb from '@/db/connectDb'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { amount, to_user, name, message } = await req.json()
    const rupees = Number(amount)
    if (!rupees || rupees <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    await connectDb()
    const recipient = await User.findOne({ username: to_user })
    const secret = recipient?.stripeSecretKey
    if (!secret) {
      return NextResponse.json({ error: 'Stripe not configured for this creator' }, { status: 400 })
    }

    const stripe = new Stripe(secret)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(rupees * 100), // INR paise
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        to_user: to_user || '',
        name: name || '',
        message: message || ''
      }
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create PaymentIntent' }, { status: 500 })
  }
}