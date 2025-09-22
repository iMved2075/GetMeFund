import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authoptions } from '@/app/api/auth/[...nextauth]/route'
import connectDb from '@/db/connectDb'
import User from '@/models/User'

export async function DELETE() {
  try {
    const session = await getServerSession(authoptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDb()

    const res = await User.deleteOne({ email: session.user.email })

    if (res.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Account deletion failed:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
