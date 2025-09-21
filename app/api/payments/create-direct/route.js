// filepath: c:\Users\ved20\Desktop\mern\next\getmefund\app\api\payments\create-direct\route.js
import { NextResponse } from 'next/server';
import connectDb from '@/db/connectDb';
import Payment from '@/models/Payment';

export async function POST(req) {
  try {
    const payment = await req.json();
    
    await connectDb();
    const result = await Payment.create(payment);
    
    return NextResponse.json({ success: true, payment: result });
  } catch (err) {
    console.error('Failed to create payment:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}