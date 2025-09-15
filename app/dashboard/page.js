"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession,signOut } from 'next-auth/react'

const Dashboard = () => {
  const {data:session} = useSession()
  const router = useRouter()
  useEffect(() => {
    if(!session){
      router.push('/login')
    }
  }, [session,router])
  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard
