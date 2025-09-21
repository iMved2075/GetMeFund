import Stripe from 'stripe'
import connectDb from '@/db/connectDb'
import Payment from '@/models/Payment'
import User from '@/models/User'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req, { params }) {
  const username = params?.username
  console.log('📌 Webhook received for user:', username)

  if (!username) {
    return new Response('Missing username', { status: 400 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    console.error('❌ Missing stripe-signature header')
    return new Response('Missing signature', { status: 400 })
  }

  const rawBody = await req.text()
  console.log('📦 Raw body length:', rawBody.length)

  await connectDb()
  const user = await User.findOne({ username })
  const webhookSecret = user?.stripeWebhookSecret
  if (!webhookSecret) {
    console.error('❌ No webhook secret found for user:', username)
    return new Response('Webhook not configured for this user', { status: 400 })
  }

  let event
  try {
    // API key is not required for verification, but Stripe SDK requires an instance
    const stripe = new Stripe(user.stripeSecretKey || 'sk_test_dummy')
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    console.log('✅ Event verified:', event.type)
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object
      const meta = pi.metadata || {}

      console.log('💰 Payment succeeded:', pi.id)
      console.log('📋 Metadata:', JSON.stringify(meta))

      const payment = await Payment.findOneAndUpdate(
        { oid: pi.id },
        {
          oid: pi.id,
          name: meta.name || 'Anonymous',
          to_user: meta.to_user || username,
          amount: (pi.amount ?? 0) / 100,
          message: meta.message || '',
          done: true,
          updatedAt: new Date()
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runValidators: true
        }
      )

      console.log('✅ Payment saved:', JSON.stringify(payment))
    } else {
      console.log('ℹ️ Ignoring event:', event.type)
    }
  } catch (err) {
    console.error('❌ Webhook handler failed:', err.message)
    console.error(err.stack)
    return new Response('Webhook handler failed: ' + err.message, { status: 500 })
  }

  return new Response('OK', { status: 200 })
}
