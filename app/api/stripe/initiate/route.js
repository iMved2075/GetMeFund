import { NextResponse } from 'next/server'
import { initiate } from '@/actions/useractions'

export async function POST(req) {
  try {
    const { amount, to_user, name, message } = await req.json()
    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    const pi = await initiate(amount, to_user, { name, message })
    return NextResponse.json({ clientSecret: pi.client_secret, id: pi.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
  }
}