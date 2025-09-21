"use server"
import Stripe from 'stripe'
import connectDb from '@/db/connectDb'
import User from '@/models/User'
import Payment from '@/models/Payment'

export const initiate = async (amount, to_username, paymentform) => {
  await connectDb()
  // Load the recipient's Stripe secret key from DB
  const recipient = await User.findOne({ username: to_username })
  const secret = recipient?.stripeSecretKey
  if (!secret) {
    throw new Error('Stripe not configured for this creator')
  }
  const stripe = new Stripe(secret)

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
  const u = await User.findOne({ username })
  return u ? u.toObject({ flattenObjectIds: true }) : null
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
  let u = await User.findOne({email:username})
  if(info.username && info.username !== u.username) {
    let existingUser = await User.findOne({username: info.username})
    if(existingUser) {
      throw new Error("Username already taken")
    }
    else{
      await User.updateOne({email:username}, {username: info.username,firstName: info.firstName, lastName: info.lastName, role: info.role, phone: info.phone, bio: info.bio}, {new: true})
      await Payment.updateMany({to_user: u.username}, {to_user: info.username})
    }
  }
  await User.findOneAndUpdate({email:username}, {firstName: info.firstName, lastName: info.lastName, role: info.role, phone: info.phone, bio: info.bio}, {new: true})
}

export const setAddress = async (username, addr) => {
  await connectDb()
  await User.findOneAndUpdate({email:username}, {country: addr.country, cityState: addr.cityState, postalCode: addr.postalCode}, {new: true})
}

export const setPaymentInfo = async (username, info) => {
  await connectDb()
  await User.findOneAndUpdate({email:username}, {stripePublishableKey: info.publishableKey, stripeSecretKey: info.secretKey}, {new: true})
}

export const setProfilePic = async (username, info) => {
  await connectDb()
  await User.findOneAndUpdate({email:username}, {profilePic: info.profilePic, coverPic: info.coverPic}, {new: true})
}