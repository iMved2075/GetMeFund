"use client"
import React, { useState, useEffect } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import { fetchuser, fetchpayments } from '@/actions/useractions'
import ProfilePicModal from './ProfilePicModal'
import CoverPicModal from './CoverPicModal'

// Form rendered when Stripe is NOT configured (no Elements wrapper, no hooks)
function DonateFormNoStripe({ username }) {
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
          onDoubleClick={() => setIsCoverPicOpen(true)} 
        />
        <div className='absolute -bottom-25 right-[43.5%] border-2 border-white rounded-full'>
          <img 
            className='rounded-full h-48 w-48 cursor-pointer hover:opacity-90 transition-opacity' 
            src={profilePicLinks.profilePic} 
            alt="profile" 
            onDoubleClick={() => setIsProfilePicOpen(true)} 
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
          onDoubleClick={() => setIsCoverPicOpen(true)} 
        />
        <div className='absolute -bottom-15 right-[25%] md:right-[43.5%] border-2 border-white rounded-full'>
          <img 
            className='rounded-full h-48 w-48 cursor-pointer transition-opacity' 
            src={profilePicLinks.profilePic} 
            alt="profile" 
            onDoubleClick={() => setIsProfilePicOpen(true)} 
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

  // Always render the page.
  // If Stripe is configured, wrap the Stripe-specific form with Elements; otherwise render non-Stripe form.
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
