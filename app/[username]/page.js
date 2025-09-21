import React from 'react'
import { notFound } from 'next/navigation'
import PaymentPage from '@/components/PaymentPage'
import connectDb from '@/db/connectDb'
import User from '@/models/User'

const Username = async({ params }) => {
  // Await params to get the actual object
  const { username } = await params

  const checkUser = async() => {
    await connectDb()
    let u = await User.findOne({ username: username })
    if(!u) {
      return notFound()
    }
  }
  
  await checkUser()
  
  return (
    <>
      <PaymentPage username={username}/>
    </>
  )
}

export default Username

export async function generateMetadata({ params }) {
  const { username } = await params
  return {
    title: `Support ${username} - GetMeFund`,
  }
}

