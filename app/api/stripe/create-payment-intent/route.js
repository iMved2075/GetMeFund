import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req) {
  try {
    const { amount, to_username, name, message } = await req.json()
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
    }
    const rupees = Number(amount)
    if (!rupees || rupees <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(rupees * 100), // INR paise
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        to_username: to_username || '',
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