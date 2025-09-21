import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDb from '@/db/connectDb'
import Payment from '@/models/Payment'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { paymentIntentId, status } = await req.json()
    
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 })
    }

    await connectDb()
    
    // Try to infer recipient to use correct secret key
    let toUser = ''
    const existing = await Payment.findOne({ oid: paymentIntentId })
    if (existing?.to_user) toUser = existing.to_user
    
    let secret = null
    if (toUser) {
      const recipient = await User.findOne({ username: toUser })
      secret = recipient?.stripeSecretKey || null
    }
    // Fallback: if we cannot infer, we cannot safely verify without platform key
    if (!secret) {
      return NextResponse.json({ error: 'Cannot verify payment without creator key' }, { status: 400 })
    }

    const stripe = new Stripe(secret)
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