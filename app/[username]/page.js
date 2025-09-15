import React from 'react'

const Username = ({ params }) => {
  return (
    <>
      <div className='cover w-full relative'>
        <img src="./luffy.jpeg" alt="Luffy" className="object-cover w-full h-[350]" />
        <div className='absolute -bottom-25 right-[43.5%] border-2 border-white rounded-full'>
          <img className='rounded-full h-48 w-48' src="./pp.png" alt="profile" />
        </div>
      </div>
      <div className="info flex flex-col gap-2 justify-center items-center my-28">
        <div className='font-bold text-lg'>
          @{params.username}
        </div>
        <div className='text-slate-400'>
          Creating animated art for VIT's
        </div>
        <div className='text-slate-400'>
          9,719 members . 82 posts . $15,450/release
        </div>
        <div className="payment flex gap-3 w-[80%] mt-11">
          <div className="supporters w-1/2 bg-slate-900 text-white rounded-lg p-10">
            {/* Show list of supporters as a leaderboard with name, amount and message*/}
            <div className="leaderboard">
              <h2 className='font-bold text-lg text-center pb-5'>Top Supporters</h2>
              <div className="entry flex justify-between py-2 border-b border-slate-700">
                <span className="name w-1/3 font-bold">Name</span>
                <span className="amount w-1/3 font-bold">Amount</span>
                <span className="message w-1/3 font-bold">Message</span>
              </div>
              <div className="entry flex justify-between py-2 border-b border-slate-700">
                <span className="name w-1/3">John Doe</span>
                <span className="amount w-1/3">$100</span>
                <span className="message w-1/3">Keep up the great work!</span>
              </div>
              <div className="entry flex justify-between py-2 border-b border-slate-700">
                <span className="name w-1/3">Jane Smith</span>
                <span className="amount w-1/3">$50</span>
                <span className="message w-1/3">Happy to support!</span>
              </div>
              <div className="entry flex justify-between py-2 border-b border-slate-700">
                <span className="name w-1/3">Alice Johnson</span>
                <span className="amount w-1/3">$75</span>
                <span className="message w-1/3">Love your work!</span>
              </div>
              <div className="entry flex justify-between py-2 border-b border-slate-700">
                <span className="name w-1/3">Bob Brown</span>
                <span className="amount w-1/3">$30</span>
                <span className="message w-1/3">Keep it up!</span>
              </div>
            </div>
          </div>
          <div className="makePayments w-1/2 bg-slate-900 text-white rounded-lg p-10">
            <h2 className='font-bold text-lg text-center pb-5'>Support the creator</h2>
            {/* Three input fields name, message and amount and a donate button*/}
            <div className="inputFields flex flex-col gap-4">
              <input type="text" placeholder='Name' className='p-3 rounded-lg bg-slate-800 border border-slate-700' />
              <input type="text" placeholder='Message' className='p-3 rounded-lg bg-slate-800 border border-slate-700' />
              <input type="text" placeholder='Amount (USD)' className='p-3 rounded-lg bg-slate-800 border border-slate-700' />
              <div className="presetAmounts flex justify-around gap-3">
                <button className='bg-slate-800 py-2 px-5 rounded-lg hover:bg-slate-700 transition'>Donate $25</button>
                <button className='bg-slate-800 py-2 px-5 rounded-lg hover:bg-slate-700 transition'>Donate $50</button>
                <button className='bg-slate-800 py-2 px-5 rounded-lg hover:bg-slate-700 transition'>Donate $100</button>
              </div>
              <button className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 p-3 rounded-lg font-bold hover:bg-blue-700 transition'>Donate</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Username
