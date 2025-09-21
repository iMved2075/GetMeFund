import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDb from '@/db/connectDb'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const adminSecret = process.env.ADMIN_SECRET
    const provided = req.headers.get('x-admin-secret')

    if (process.env.NODE_ENV === 'production') {
      if (!adminSecret || provided !== adminSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    await connectDb()
    const db = mongoose.connection
    const col = db.collection('users')
    const indexes = await col.indexes()
    const hasBadIndex = indexes.some(i => i.name === 'id_1')

    let dropped = false
    if (hasBadIndex) {
      await col.dropIndex('id_1')
      dropped = true
    }

    return NextResponse.json({ ok: true, droppedBadIndex: dropped, indexesBefore: indexes })
  } catch (err) {
    console.error('Fix index failed:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
