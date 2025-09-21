import Stripe from 'stripe'
import connectDb from '@/db/connectDb'
import Payment from '@/models/Payment'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  // Note: For standalone per-creator Stripe accounts, prefer
  // /api/stripe/webhook/[username] so each creator can set their own webhook secret.
  // This route remains for single-account/platform setups.

  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('❌ Missing STRIPE_WEBHOOK_SECRET')
    return new Response('Missing webhook secret', { status: 500 })
  }
  
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    console.error('❌ Missing stripe-signature header')
    return new Response('Missing signature', { status: 400 })
  }
  
  const rawBody = await req.text()


  let event
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object
      const meta = pi.metadata || {}
      
    
    
      
    
      try {
        await connectDb()
      
      } catch (dbErr) {
        console.error('❌ DB connection failed:', dbErr)
        throw dbErr
      }
      
    
      const payment = await Payment.findOneAndUpdate(
        { oid: pi.id },
        {
          oid: pi.id,
          name: meta.name || 'Anonymous',
          to_user: meta.to_user || '',
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
      
    
    } else {
    
    }
  } catch (err) {
    console.error('❌ Webhook handler failed:', err.message)
    console.error(err.stack)
    return new Response('Webhook handler failed: ' + err.message, { status: 500 })
  }

  return new Response('OK', { status: 200 })
}