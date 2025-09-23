"use client"
import React, { useState, useEffect } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import { fetchuser, fetchpayments } from '@/actions/useractions'
import ProfilePicModal from './ProfilePicModal'
import CoverPicModal from './CoverPicModal'
import { useSession } from 'next-auth/react'

// Form rendered when Stripe is NOT configured (no Elements wrapper, no hooks)
function DonateFormNoStripe({ username }) {
  const { data: session } = useSession()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [currentUser, setcurrentUser] = useState({})
  const [payments, setpayments] = useState([])
  const [isProfilePicOpen, setIsProfilePicOpen] = useState(false);
  const [isCoverPicOpen, setIsCoverPicOpen] = useState(false);
  const [profilePicLinks, setProfilePicLinks] = useState({  })

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    let u = await fetchuser(username)
    setcurrentUser(u || {})
    setProfilePicLinks({
      profilePic: u?.profilePic || '/pp.png',
      coverPic: u?.coverPic || '/luffy.jpeg'
    })
    let dbpayments = await fetchpayments(username)
    setpayments(dbpayments || [])
  }

  const isOwner = session?.user?.email === currentUser?.email

  const handleDonate = async () => {
    setErrorMsg('')
    // Inform user to configure Stripe
    toast.info('Stripe not configured. Please go to your Dashboard to configure Stripe.', {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      transition: Bounce,
    })
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className='cover w-full relative'>
        <img 
          src={profilePicLinks.coverPic} 
          alt="cover" 
          className="object-cover w-full h-[350] cursor-pointer hover:opacity-90 transition-opacity" 
          onDoubleClick={isOwner?() => setIsCoverPicOpen(true):undefined} 
        />
        <div className='absolute -bottom-25 right-[43.5%] border-2 border-white rounded-full'>
          <img 
            className='rounded-full h-48 w-48 cursor-pointer hover:opacity-90 transition-opacity' 
            src={profilePicLinks.profilePic} 
            alt="profile" 
            onDoubleClick={isOwner?() => setIsProfilePicOpen(true):undefined} 
          />
        </div>
        
        {/* Profile Picture Modal */}

        {isProfilePicOpen && session.status === "authenticated" && (
          <ProfilePicModal
            isOpen={isProfilePicOpen}
            onClose={() => setIsProfilePicOpen(false)}
            initialData={profilePicLinks}
            onSave={setProfilePicLinks}
            username={currentUser?.email || username}
          />
        )}

        {/* Cover Picture Modal */}
        {isCoverPicOpen && (
          <CoverPicModal
            isOpen={isCoverPicOpen}
            onClose={() => setIsCoverPicOpen(false)}
            initialData={profilePicLinks}
            onSave={setProfilePicLinks}
            username={currentUser?.email || username}
          />
        )}
      </div>
      
      <div className="info flex flex-col gap-2 justify-center items-center my-28">
        <div className='font-bold text-lg'>
          @{currentUser?.username || 'user'}
        </div>
        <div className='text-slate-400'>
          {currentUser?.bio || 'This user has no bio'}
        </div>
        {/* Social media buttons */}
        <div className="flex gap-3 p-2">
          {currentUser?.socialMedia?.facebook && (
            <a href={currentUser.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xNCAxMy41aDIuNWwxLTRIMTR2LTJjMC0xLjAzIDAtMiAyLTJoMS41VjIuMTRjLS4zMjYtLjA0My0xLjU1Ny0uMTQtMi44NTctLjE0QzExLjkyOCAyIDEwIDMuNjU3IDEwIDYuN3YyLjhIN3Y0aDNWMjJoNHoiLz48L3N2Zz4=" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="Facebook" />
            </a>
          )}
          {currentUser?.socialMedia?.twitter && (
            <a href={currentUser.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij48ZyBmaWxsPSJub25lIj48ZyBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMS4wMjUuNjU2aDIuMTQ3TDguNDgyIDYuMDNMMTQgMTMuMzQ0SDkuNjhMNi4yOTQgOC45MDlsLTMuODcgNC40MzVILjI3NWw1LjAxNi01Ljc1TDAgLjY1N2g0LjQzTDcuNDg2IDQuNzF6bS0uNzU1IDExLjRoMS4xOUwzLjc4IDEuODc3SDIuNTA0eiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9IlNWR0cxT3Q0Y0FEIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE0djE0SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9nPjwvc3ZnPg==" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="X" />
            </a>
          )}
          {currentUser?.socialMedia?.linkedin && (
            <a href={currentUser.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjUxIDguNzk2djEuNjk3YTMuNzQgMy43NCAwIDAgMSAzLjI4OC0xLjY4NGMzLjQ1NSAwIDQuMjAyIDIuMTYgNC4yMDIgNC45N1YxOS41aC0zLjJ2LTUuMDcyYzAtMS4yMS0uMjQ0LTIuNzY2LTIuMTI4LTIuNzY2Yy0xLjgyNyAwLTIuMTM5IDEuMzE3LTIuMTM5IDIuNjc2VjE5LjVoLTMuMTlWOC43OTZoMy4xNjhaTTcuMiA2LjEwNmExLjYxIDEuNjEgMCAwIDEtLjk4OCAxLjQ4M2ExLjU5NSAxLjU5NSAwIDAgMS0xLjc0My0uMzQ4QTEuNjA3IDEuNjA3IDAgMCAxIDUuNiA0LjVhMS42IDEuNiAwIDAgMSAxLjYgMS42MDYiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik03LjIgOC44MDlINFYxOS41aDMuMnoiLz48L2c+PC9zdmc+" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="LinkedIn" />
            </a>
          )}
          {currentUser?.socialMedia?.instagram && (
            <a href={currentUser.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJtMTIuNTkzIDIzLjI1OGwtLjAxMS4wMDJsLS4wNzEuMDM1bC0uMDIuMDA0bC0uMDE0LS4wMDRsLS4wNzEtLjAzNXEtLjAxNi0uMDA1LS4wMjQuMDA1bC0uMDA0LjAxbC0uMDE3LjQyOGwuMDA1LjAybC4wMS4wMTNsLjEwNC4wNzRsLjAxNS4wMDRsLjAxMi0uMDA0bC4xMDQtLjA3NGwuMDEyLS4wMTZsLjAwNC0uMDE3bC0uMDE3LS40MjdxLS4wMDQtLjAxNi0uMDE3LS4wMThtLjI2NS0uMTEzbC0uMDEzLjAwMmwtLjE4NS4wOTNsLS4wMS4wMWwtLjAwMy4wMTFsLjAxOC40M2wuMDA1LjAxMmwuMDA4LjAwN2wuMjAxLjA5M3EuMDE5LjAwNS4wMjktLjAwOGwuMDA0LS4wMTRsLS4wMzQtLjYxNHEtLjAwNS0uMDE4LS4wMi0uMDIybS0uNzE1LjAwMmEuMDIuMDIgMCAwIDAtLjAyNy4wMDZsLS4wMDYuMDE0bC0uMDM0LjYxNHEuMDAxLjAxOC4wMTcuMDI0bC4wMTUtLjAwMmwuMjAxLS4wOTNsLjAxLS4wMDhsLjAwNC0uMDExbC4wMTctLjQzbC0uMDAzLS4wMTJsLS4wMS0uMDF6Ii8+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTYgM2E1IDUgMCAwIDEgNSA1djhhNSA1IDAgMCAxLTUgNUg4YTUgNSAwIDAgMS01LTVWOGE1IDUgMCAwIDEgNS01em0tNCA1YTQgNCAwIDEgMCAwIDhhNCA0IDAgMCAwIDAtOG0wIDJhMiAyIDAgMSAxIDAgNGEyIDIgMCAwIDEgMC00bTQuNS0zLjVhMSAxIDAgMSAwIDAgMmExIDEgMCAwIDAgMC0yIi8+PC9nPjwvc3ZnPg==" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="Instagram" />
            </a>
          )}
          {currentUser?.socialMedia?.github && (
            <a href={currentUser.socialMedia.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJjMCA0LjQyIDIuODcgOC4xNyA2Ljg0IDkuNWMuNS4wOC42Ni0uMjMuNjYtLjV2LTEuNjljLTIuNzcuNi0zLjM2LTEuMzQtMy4zNi0xLjM0Yy0uNDYtMS4xNi0xLjExLTEuNDctMS4xMS0xLjQ3Yy0uOTEtLjYyLjA3LS42LjA3LS42YzEgLjA3IDEuNTMgMS4wMyAxLjUzIDEuMDNjLjg3IDEuNTIgMi4zNCAxLjA3IDIuOTEuODNjLjA5LS42NS4zNS0xLjA5LjYzLTEuMzRjLTIuMjItLjI1LTQuNTUtMS4xMS00LjU1LTQuOTJjMC0xLjExLjM4LTIgMS4wMy0yLjcxYy0uMS0uMjUtLjQ1LTEuMjkuMS0yLjY0YzAgMCAuODQtLjI3IDIuNzUgMS4wMmMuNzktLjIyIDEuNjUtLjMzIDIuNS0uMzNzMS43MS4xMSAyLjUuMzNjMS45MS0xLjI5IDIuNzUtMS4wMiAyLjc1LTEuMDJjLjU1IDEuMzUuMiAyLjM5LjEgMi42NGMuNjUuNzEgMS4wMyAxLjYgMS4wMyAyLjcxYzAgMy44Mi0yLjM0IDQuNjYtNC41NyA0LjkxYy4zNi4zMS42OS45Mi42OSAxLjg1VjIxYzAgLjI3LjE2LjU5LjY3LjVDMTkuMTQgMjAuMTYgMjIgMTYuNDIgMjIgMTJBMTAgMTAgMCAwIDAgMTIuMiA2IiBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIi8+PC9zdmc+" alt="GitHub" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" />
            </a>
          )}
          {currentUser?.socialMedia?.youtube && (
            <a href={currentUser.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Im0xMCAxNWw1LjE5LTNMMTAgOXptMTEuNTYtNy44M2MuMTMuNDcuMjIgMS4xLjI4IDEuOWMuMDcuOC4xIDEuNDkuMSAyLjA5TDIyIDEyYzAgMi4xOS0uMTYgMy44LS40NCA0LjgzYy0uMjUuOS0uODMgMS40OC0xLjczIDEuNzNjLS40Ny4xMy0xLjMzLjIyLTIuNjUuMjhjLTEuMy4wNy0yLjQ5LjEtMy41OS4xTDEyIDE5Yy00LjE5IDAtNi44LS4xNi03LjgzLS40NGMtLjktLjI1LTEuNDgtLjgzLTEuNzMtMS43M2MtLjEzLS40Ny0uMjItMS4xLS4yOC0xLjljLS4wNy0uOC0uMS0xLjQ5LS4xLTIuMDlMMiAxMmMwLTIuMTkuMTYtMy44LjQ0LTQuODNjLjI1LS45LjgzLTEuNDggMS43My0xLjczYy40Ny0uMTMgMS4zMy0uMjIgMi42NS0uMjhjMS4zLS4wNyAyLjQ5LS4xIDMuNTktLjFMMTIgNWM0LjE5IDAgNi44LjE2IDcuODMuNDRjLjkuMjUgMS40OC44MyAxLjczIDEuNzMiLz48L3N2Zz4=" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="YouTube" />
            </a>
          )}
        </div>
        <div className='text-slate-400'>
          9,719 members . 82 posts . $15,450/release
        </div>
        <div className="payment flex gap-3 w-[80%] mt-11">
          <div className="supporters w-1/2 bg-slate-900 text-white rounded-lg p-10">
            {/* Show list of supporters as a leaderboard with name, amount and message*/}
            <div className="leaderboard">
              <h2 className='font-bold text-lg text-center pb-5'>Top Supporters</h2>
              <div className="entry flex gap-10 justify-between py-2 border-b border-slate-700">
                <span className="name w-1/3 font-bold">Name</span>
                <span className="amount w-1/3 font-bold">Amount</span>
                <span className="message w-1/3 font-bold">Message</span>
              </div>
              {payments.map((p, index) => {
                return <div key={index} className="entry flex gap-10 justify-between py-2 border-b border-slate-700">
                  <span className="flex gap-4 name w-1/3 p-2"><span>{p.name}</span></span>
                  <span className="amount w-1/3 p-2">{p.amount}</span>
                  <span className="message w-1/3 p-2">{p.message}</span>
                </div>
              })}
            </div>
          </div>
          <div className="makePayments w-1/2 bg-slate-900 text-white rounded-lg p-10">
            <h2 className='font-bold text-lg text-center pb-5'>Support the creator</h2>
            <div className="inputFields flex flex-col gap-4">
              <input
                type="text"
                placeholder='Name'
                className='p-3 rounded-lg bg-slate-800 border border-slate-700'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder='Message'
                className='p-3 rounded-lg bg-slate-800 border border-slate-700'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <input
                type="number"
                placeholder='Amount (INR)'
                className='p-3 rounded-lg bg-slate-800 border border-slate-700'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
              />
              <div className="presetAmounts flex justify-around gap-3">
                <button type="button" className='bg-slate-800 py-2 px-10 rounded-lg hover:bg-slate-700 transition' onClick={() => setAmount(100)}>Donate ₹100</button>
                <button type="button" className='bg-slate-800 py-2 px-10 rounded-lg hover:bg-slate-700 transition' onClick={() => setAmount(200)}>Donate ₹200</button>
                <button type="button" className='bg-slate-800 py-2 px-10 rounded-lg hover:bg-slate-700 transition' onClick={() => setAmount(500)}>Donate ₹500</button>
              </div>

              {/* Card details */}
              <div className='p-3 rounded-lg bg-slate-800 border border-slate-700'>
                <div className="text-slate-400 text-sm">
                  Card input disabled — Stripe not configured for this creator.
                </div>
              </div>

              {/* Error message */}
              {errorMsg && (
                <div className="text-red-400 font-semibold text-center mb-2">{errorMsg}</div>
              )}

              <button
                className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 p-3 rounded-lg font-bold disabled:opacity-60'
                onClick={handleDonate}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Donate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Form rendered only when Stripe is configured (inside Elements, uses hooks)
function DonateFormStripe({ username }) {
  const { data: session } = useSession()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [currentUser, setcurrentUser] = useState({})
  const [payments, setpayments] = useState([])
  const [isProfilePicOpen, setIsProfilePicOpen] = useState(false);
  const [isCoverPicOpen, setIsCoverPicOpen] = useState(false);
  const [profilePicLinks, setProfilePicLinks] = useState({})

  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    (async () => {
      let u = await fetchuser(username)
      setcurrentUser(u || {})
      setProfilePicLinks({
        profilePic: u?.profilePic || '/pp.png',
        coverPic: u?.coverPic || '/luffy.jpeg'
      })
      let dbpayments = await fetchpayments(username)
      setpayments(dbpayments || [])
    })()
  }, [username])

  const handleDonate = async () => {
    setErrorMsg('')
    if (!amount || Number(amount) <= 0) return setErrorMsg('Enter a valid amount')
    if (!stripe || !elements) return setErrorMsg('Stripe is initializing, please wait...')

    try {
      setLoading(true)
      const res = await fetch('/api/stripe/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), to_user: username, name, message })
      })
      const data = await res.json()
      if (!res.ok || !data?.clientSecret) throw new Error(data?.error || 'Failed to create payment')

      const card = elements.getElement(CardElement)
      const confirmResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card, billing_details: { name: name || 'Anonymous' } }
      })

      if (confirmResult.error) {
        setErrorMsg(confirmResult.error.message || 'Payment failed')
        return
      }

      if (confirmResult.paymentIntent?.status === 'succeeded') {
        try {
          await fetch('/api/payments/create-direct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              oid: confirmResult.paymentIntent.id,
              name,
              to_user: username,
              amount: Number(amount),
              message,
              done: true
            })
          })
        } catch (e) { /* optional fallback failure ignored */ }

        toast.success('🦄 Payment Successful!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        })
        setName(''); setMessage(''); setAmount('')
        elements.getElement(CardElement)?.clear()
      }
    } catch (e) {
      toast.error('🦄 Error!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      })
      setErrorMsg(e.message || 'Unable to process payment. Try again.')
      console.error('Payment error:', e)
    } finally {
      setLoading(false)
    }
  }
  const isOwner = session?.user?.email === currentUser?.email

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className='cover w-full relative pb-10'>
        
        <img 
          src={profilePicLinks.coverPic} 
          alt="cover" 
          className="object-cover w-full h-[350] cursor-pointer transition-opacity" 
          onDoubleClick={isOwner ? () => setIsCoverPicOpen(true) : undefined} 
        />
        <div className='absolute -bottom-15 right-[25%] md:right-[43.5%] border-2 border-white rounded-full'>
          <img 
            className='rounded-full h-48 w-48 cursor-pointer transition-opacity' 
            src={profilePicLinks.profilePic} 
            alt="profile" 
            onDoubleClick={isOwner ? () => setIsProfilePicOpen(true) : undefined} 
          />
        </div>

        {/* Profile Picture Modal */}
        {isProfilePicOpen && (
          <ProfilePicModal
            isOpen={isProfilePicOpen}
            onClose={() => setIsProfilePicOpen(false)}
            initialData={profilePicLinks}
            onSave={setProfilePicLinks}
            username={currentUser?.email || username}
          />
        )}

        {/* Cover Picture Modal */}
        {isCoverPicOpen && (
          <CoverPicModal
            isOpen={isCoverPicOpen}
            onClose={() => setIsCoverPicOpen(false)}
            initialData={profilePicLinks}
            onSave={setProfilePicLinks}
            username={currentUser?.email || username}
          />
        )}
      </div>
      
      <div className="info flex flex-col gap-2 justify-center items-center my-28">
        <div className='font-bold text-lg'>
          @{currentUser?.username || 'user'}
        </div>
        <div className='text-slate-400'>
          {currentUser?.bio || 'This user has no bio'}
        </div>
        {/* Social media buttons */}
        <div className="flex gap-3 p-2">
          {currentUser?.socialMedia?.facebook && (
            <a href={currentUser.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xNCAxMy41aDIuNWwxLTRIMTR2LTJjMC0xLjAzIDAtMiAyLTJoMS41VjIuMTRjLS4zMjYtLjA0My0xLjU1Ny0uMTQtMi44NTctLjE0QzExLjkyOCAyIDEwIDMuNjU3IDEwIDYuN3YyLjhIN3Y0aDNWMjJoNHoiLz48L3N2Zz4=" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="Facebook" />
            </a>
          )}
          {currentUser?.socialMedia?.twitter && (
            <a href={currentUser.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij48ZyBmaWxsPSJub25lIj48ZyBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMS4wMjUuNjU2aDIuMTQ3TDguNDgyIDYuMDNMMTQgMTMuMzQ0SDkuNjhMNi4yOTQgOC45MDlsLTMuODcgNC40MzVILjI3NWw1LjAxNi01Ljc1TDAgLjY1N2g0LjQzTDcuNDg2IDQuNzF6bS0uNzU1IDExLjRoMS4xOUwzLjc4IDEuODc3SDIuNTA0eiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9IlNWR0cxT3Q0Y0FEIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE0djE0SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9nPjwvc3ZnPg==" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="X" />
            </a>
          )}
          {currentUser?.socialMedia?.linkedin && (
            <a href={currentUser.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjUxIDguNzk2djEuNjk3YTMuNzQgMy43NCAwIDAgMSAzLjI4OC0xLjY4NGMzLjQ1NSAwIDQuMjAyIDIuMTYgNC4yMDIgNC45N1YxOS41aC0zLjJ2LTUuMDcyYzAtMS4yMS0uMjQ0LTIuNzY2LTIuMTI4LTIuNzY2Yy0xLjgyNyAwLTIuMTM5IDEuMzE3LTIuMTM5IDIuNjc2VjE5LjVoLTMuMTlWOC43OTZoMy4xNjhaTTcuMiA2LjEwNmExLjYxIDEuNjEgMCAwIDEtLjk4OCAxLjQ4M2ExLjU5NSAxLjU5NSAwIDAgMS0xLjc0My0uMzQ4QTEuNjA3IDEuNjA3IDAgMCAxIDUuNiA0LjVhMS42IDEuNiAwIDAgMSAxLjYgMS42MDYiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik03LjIgOC44MDlINFYxOS41aDMuMnoiLz48L2c+PC9zdmc+" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="LinkedIn" />
            </a>
          )}
          {currentUser?.socialMedia?.instagram && (
            <a href={currentUser.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJtMTIuNTkzIDIzLjI1OGwtLjAxMS4wMDJsLS4wNzEuMDM1bC0uMDIuMDA0bC0uMDE0LS4wMDRsLS4wNzEtLjAzNXEtLjAxNi0uMDA1LS4wMjQuMDA1bC0uMDA0LjAxbC0uMDE3LjQyOGwuMDA1LjAybC4wMS4wMTNsLjEwNC4wNzRsLjAxNS4wMDRsLjAxMi0uMDA0bC4xMDQtLjA3NGwuMDEyLS4wMTZsLjAwNC0uMDE3bC0uMDE3LS40MjdxLS4wMDQtLjAxNi0uMDE3LS4wMThtLjI2NS0uMTEzbC0uMDEzLjAwMmwtLjE4NS4wOTNsLS4wMS4wMWwtLjAwMy4wMTFsLjAxOC40M2wuMDA1LjAxMmwuMDA4LjAwN2wuMjAxLjA5M3EuMDE5LjAwNS4wMjktLjAwOGwuMDA0LS4wMTRsLS4wMzQtLjYxNHEtLjAwNS0uMDE4LS4wMi0uMDIybS0uNzE1LjAwMmEuMDIuMDIgMCAwIDAtLjAyNy4wMDZsLS4wMDYuMDE0bC0uMDM0LjYxNHEuMDAxLjAxOC4wMTcuMDI0bC4wMTUtLjAwMmwuMjAxLS4wOTNsLjAxLS4wMDhsLjAwNC0uMDExbC4wMTctLjQzbC0uMDAzLS4wMTJsLS4wMS0uMDF6Ii8+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTYgM2E1IDUgMCAwIDEgNSA1djhhNSA1IDAgMCAxLTUgNUg4YTUgNSAwIDAgMS01LTVWOGE1IDUgMCAwIDEgNS01em0tNCA1YTQgNCAwIDEgMCAwIDhhNCA0IDAgMCAwIDAtOG0wIDJhMiAyIDAgMSAxIDAgNGEyIDIgMCAwIDEgMC00bTQuNS0zLjVhMSAxIDAgMSAwIDAgMmExIDEgMCAwIDAgMC0yIi8+PC9nPjwvc3ZnPg==" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="Instagram" />
            </a>
          )}
          {currentUser?.socialMedia?.github && (
            <a href={currentUser.socialMedia.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJjMCA0LjQyIDIuODcgOC4xNyA2Ljg0IDkuNWMuNS4wOC42Ni0uMjMuNjYtLjV2LTEuNjljLTIuNzcuNi0zLjM2LTEuMzQtMy4zNi0xLjM0Yy0uNDYtMS4xNi0xLjExLTEuNDctMS4xMS0xLjQ3Yy0uOTEtLjYyLjA3LS42LjA3LS42YzEgLjA3IDEuNTMgMS4wMyAxLjUzIDEuMDNjLjg3IDEuNTIgMi4zNCAxLjA3IDIuOTEuODNjLjA5LS42NS4zNS0xLjA5LjYzLTEuMzRjLTIuMjItLjI1LTQuNTUtMS4xMS00LjU1LTQuOTJjMC0xLjExLjM4LTIgMS4wMy0yLjcxYy0uMS0uMjUtLjQ1LTEuMjkuMS0yLjY0YzAgMCAuODQtLjI3IDIuNzUgMS4wMmMuNzktLjIyIDEuNjUtLjMzIDIuNS0uMzNzMS43MS4xMSAyLjUuMzNjMS45MS0xLjI5IDIuNzUtMS4wMiAyLjc1LTEuMDJjLjU1IDEuMzUuMiAyLjM5LjEgMi42NGMuNjUuNzEgMS4wMyAxLjYgMS4wMyAyLjcxYzAgMy44Mi0yLjM0IDQuNjYtNC41NyA0LjkxYy4zNi4zMS42OS45Mi42OSAxLjg1VjIxYzAgLjI3LjE2LjU5LjY3LjVDMTkuMTQgMjAuMTYgMjIgMTYuNDIgMjIgMTJBMTAgMTAgMCAwIDAgMTIuMiA2IiBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIi8+PC9zdmc+" alt="GitHub" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" />
            </a>
          )}
          {currentUser?.socialMedia?.youtube && (
            <a href={currentUser.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Im0xMCAxNWw1LjE5LTNMMTAgOXptMTEuNTYtNy44M2MuMTMuNDcuMjIgMS4xLjI4IDEuOWMuMDcuOC4xIDEuNDkuMSAyLjA5TDIyIDEyYzAgMi4xOS0uMTYgMy44LS40NCA0LjgzYy0uMjUuOS0uODMgMS40OC0xLjczIDEuNzNjLS40Ny4xMy0xLjMzLjIyLTIuNjUuMjhjLTEuMy4wNy0yLjQ5LjEtMy41OS4xTDEyIDE5Yy00LjE5IDAtNi44LS4xNi03LjgzLS40NGMtLjktLjI1LTEuNDgtLjgzLTEuNzMtMS43M2MtLjEzLS40Ny0uMjItMS4xLS4yOC0xLjljLS4wNy0uOC0uMS0xLjQ5LS4xLTIuMDlMMiAxMmMwLTIuMTkuMTYtMy44LjQ0LTQuODNjLjI1LS45LjgzLTEuNDggMS43My0xLjczYy40Ny0uMTMgMS4zMy0uMjIgMi42NS0uMjhjMS4zLS4wNyAyLjQ5LS4xIDMuNTktLjFMMTIgNWM0LjE5IDAgNi44LjE2IDcuODMuNDRjLjkuMjUgMS40OC44MyAxLjczIDEuNzMiLz48L3N2Zz4=" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="YouTube" />
            </a>
          )}
        </div>
        <div className='text-slate-400'>
          <span>{payments.length} payments </span>
          <span className='font-extrabold'> . </span>
          <span>₹ {payments.reduce((acc, p) => acc + p.amount, 0)} collected</span>
        </div>
        <div className="payment flex md:flex-row flex-col gap-3 w-[80%] mt-11">
          <div className="supporters md:w-1/2 bg-slate-900 text-white rounded-lg p-10">
            {/* Show list of supporters as a leaderboard with name, amount and message*/}
            <div className="leaderboard">
              <h2 className='font-bold text-lg text-center pb-5'>Top Supporters</h2>
              <div className="entry flex gap-10 justify-between py-2 border-b border-slate-700">
                <span className="name w-1/3 font-bold">Name</span>
                <span className="amount w-1/3 font-bold">Amount</span>
                <span className="md:inline hidden message w-1/3 font-bold">Message</span>
              </div>
              {payments.map((p, index) => {
                return <div key={index} className="entry flex gap-10 justify-between py-2 border-b border-slate-700">
                  <span className="flex gap-4 name w-1/3 p-2"><span>{p.name}</span></span>
                  <span className="amount w-1/3 p-2">{p.amount}</span>
                  <span className="md:inline hidden message w-1/3 p-2">{p.message}</span>
                </div>
              })}
            </div>
          </div>
          <div className="makePayments md:w-1/2 bg-slate-900 text-white rounded-lg p-10">
            <h2 className='font-bold text-lg text-center pb-5'>Support the creator</h2>
            <div className="inputFields flex flex-col gap-4">
              <input
                type="text"
                placeholder='Name'
                className='p-3 rounded-lg bg-slate-800 border border-slate-700'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder='Message'
                className='p-3 rounded-lg bg-slate-800 border border-slate-700'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <input
                type="number"
                placeholder='Amount (INR)'
                className='p-3 rounded-lg bg-slate-800 border border-slate-700'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
              />
              <div className="presetAmounts justify-around gap-3 md:flex hidden">
                <button type="button" className='bg-slate-800 py-2 px-10 rounded-lg hover:bg-slate-700 transition' onClick={() => setAmount(100)}>Donate ₹100</button>
                <button type="button" className='bg-slate-800 py-2 px-10 rounded-lg hover:bg-slate-700 transition' onClick={() => setAmount(200)}>Donate ₹200</button>
                <button type="button" className='bg-slate-800 py-2 px-10 rounded-lg hover:bg-slate-700 transition' onClick={() => setAmount(500)}>Donate ₹500</button>
              </div>
              <div className="text-xs text-center text-red-700">For dummy payment use card no: 4242 4242 4242 4242 expiry: 12/34 cvs: 123</div>
              {/* Card details */}
              <div className='p-3 rounded-lg bg-slate-800 border border-slate-700'>
                <CardElement options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      color: "#fff",
                      fontSize: "16px",
                      '::placeholder': { color: "#ccc" }
                    },
                    invalid: { color: "#ff6666" }
                  }
                }} />
              </div>

              {/* Error message */}
              {errorMsg && (
                <div className="text-red-400 font-semibold text-center mb-2">{errorMsg}</div>
              )}

              <button
                className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 p-3 rounded-lg font-bold disabled:opacity-60'
                onClick={handleDonate}
                disabled={name.trim().length < 3 || !amount || Number(amount) <= 0 || message.trim().length < 1 || Number(amount) > 50000 || loading}
              >
                {loading ? 'Processing...' : 'Donate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const PaymentPage = ({ username }) => {
  const [stripePromise, setStripePromise] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const user = await fetchuser(username)
        const pk = user?.stripePublishableKey?.trim()
        if (!pk) {
          if (mounted) setStripePromise(null)
          return
        }
        const p = await loadStripe(pk)
        if (mounted) setStripePromise(p)
      } catch (e) {
        console.error('Failed to load user publishable key:', e)
        if (mounted) setStripePromise(null)
      }
    })()
    return () => { mounted = false }
  }, [username])

  if (stripePromise) {
    return (
      <Elements stripe={stripePromise}>
        <DonateFormStripe username={username} />
      </Elements>
    )
  }

  // No Stripe config: render form without Elements; clicking Donate shows a toast.
  return <DonateFormNoStripe username={username} />
}

export default PaymentPage
