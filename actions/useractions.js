"use server"
import Stripe from 'stripe'
import connectDb from '@/db/connectDb'
import User from '@/models/User'
import Payment from '@/models/Payment'

export const initiate = async (amount, to_username, paymentform) => {
  await connectDb()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const rupees = Number(amount)
  const paise = Math.round(rupees * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: paise,
    currency: 'inr',
    automatic_payment_methods: { enabled: true },
    metadata: {
      to_user: to_username,
      name: paymentform?.name || 'Anonymous',
      message: paymentform?.message || ''
    }
  })

  // Let webhook handle the database operations
  return paymentIntent
}

export const fetchuser = async (username) => {
  await connectDb()
  let u = await User.findOne({ username:username })
  let user = u.toObject({flattenObjectIds: true})
  return user
}

export const fetchpayments = async (username) => {
  await connectDb()
  // find payments sorted by decreasing order by amount and flatten objectids and only return top 5 users

  let p = await Payment.find({to_user:username}).sort({amount:-1}).limit(5)
  return p.map(payment => payment.toObject({flattenObjectIds: true}))
}

export const setSocialLinks = async (username, links) => {
  await connectDb()
  await User.findOneAndUpdate({email:username}, {socialMedia: links}, {new: true})
}

export const setPersonalInfo = async (username, info) => {
  await connectDb()
  await User.findOneAndUpdate({email:username}, {firstName: info.firstName, lastName: info.lastName, role: info.role, phone: info.phone, bio: info.bio}, {new: true})
}

export const setAddress = async (username, addr) => {
  await connectDb()
  await User.findOneAndUpdate({email:username}, {country: addr.country, cityState: addr.cityState, postalCode: addr.postalCode}, {new: true})
}