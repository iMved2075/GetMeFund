import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDb from '@/db/connectDb'
import Payment from '@/models/Payment'

export async function POST(req) {
  try {
    const { paymentIntentId, status } = await req.json()
    
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 })
    }

    await connectDb()
    
    // Verify with Stripe API
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Invalid payment' }, { status: 400 })
    }
    
    const meta = paymentIntent.metadata || {}
    const updatedPayment = await Payment.findOneAndUpdate(
      { oid: paymentIntentId },
      {
        done: true,
        to_user: meta.to_user || '',
        name: meta.name || 'Anonymous',
        amount: (paymentIntent.amount / 100),
        message: meta.message || '',
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    )
    
    return NextResponse.json({ success: true, payment: updatedPayment })
  } catch (err) {
    console.error('Failed to update payment:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}