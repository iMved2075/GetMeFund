"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Social from '@/components/Social'
import PersonalInfoModal from '@/components/PersonalInfoModal'
import AddressModal from '@/components/AddressModal'
import { fetchuser } from '@/actions/useractions'
import PaymentInfoModal from '@/components/PayemntInfoModal'
import ProfilePicModal from '@/components/ProfilePicModal'


const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPersonalOpen, setIsPersonalOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProfilePicOpen, setIsProfilePicOpen] = useState(false);
  const { data: session, status } = useSession()
  const router = useRouter()

  const [personalInfo, setPersonalInfo] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    role: '',
  });
  const [address, setAddress] = useState({
    country: '',
    cityState: '',
    postalCode: ''
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    github: '',
    youtube: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    publishableKey: '',
    secretKey: ''
  });

  const [profilePicLinks, setProfilePicLinks] = useState({  });

  // Copy status for visual feedback
  const [copyStatus, setCopyStatus] = useState({ pk: '', sk: '' })

  // Mask a key showing first N and last 4 chars
  const maskKey = (key, visibleStart = 6) => {
    if (!key || typeof key !== 'string') return ''
    const start = key.slice(0, visibleStart)
    const end = key.length > 4 ? key.slice(-4) : ''
    const middleLen = Math.max(0, 8)
    return `${start}${'\u2022'.repeat(middleLen)}${end}`
  }

  const handleCopy = async (text, type) => {
    try {
      if (!text) return
      await navigator.clipboard.writeText(text)
      setCopyStatus((s) => ({ ...s, [type]: 'Copied!' }))
      setTimeout(() => setCopyStatus((s) => ({ ...s, [type]: '' })), 1500)
    } catch (e) {
      console.error('Copy failed:', e)
      setCopyStatus((s) => ({ ...s, [type]: 'Copy failed' }))
      setTimeout(() => setCopyStatus((s) => ({ ...s, [type]: '' })), 1500)
    }
  }

  const getData = async () => {
    let u = await fetchuser(session.user.name)
    setPersonalInfo({
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      bio: u.bio,
      role: u.role,
    })
    setAddress({
      country: u.country,
      cityState: u.cityState,
      postalCode: u.postalCode
    })
    setSocialLinks({
      facebook: u.socialMedia.facebook,
      twitter: u.socialMedia.twitter,
      linkedin: u.socialMedia.linkedin,
      instagram: u.socialMedia.instagram,
      github: u.socialMedia.github,
      youtube: u.socialMedia.youtube
    })
    setPaymentInfo({
      publishableKey: u.stripePublishableKey,
      secretKey: u.stripeSecretKey
    })
    setProfilePicLinks({
      profilePic: u.profilePic || './pp.png',
      coverPic: u.coverPic || './luffy.jpeg'
    })
  }

  useEffect(() => {
    document.title = "Dashboard - GetMeFund"
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    else if (status === 'authenticated' && session && session.user) {
      getData()
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <>
      <div className='flex flex-col gap-5 m-10 bg-slate-900 rounded-xl p-10'>
        <h2 className='font-bold text-lg px-2'>Profile</h2>
        <div className='flex justify-between border-2 border-slate-800 rounded-xl'>
          <div className='flex gap-5 p-8'>
            <img 
              className='rounded-full w-20 h-20 cursor-pointer hover:opacity-90 transition-opacity' 
              src={profilePicLinks.profilePic} 
              alt="profile" 
              onClick={() => setIsProfilePicOpen(true)} 
            />
            
            {/* Profile Picture Modal */}
            {isProfilePicOpen && (
              <ProfilePicModal
                isOpen={isProfilePicOpen}
                onClose={() => setIsProfilePicOpen(false)}
                initialData={profilePicLinks}
                onSave={setProfilePicLinks}
                username={personalInfo.email}
              />
            )}           
            <div className='flex flex-col gap-2 p-3'>
              <span className='name font-bold'>
                {personalInfo.username}
              </span>
              <span className='role text-slate-400'>
                {personalInfo.role} | {address.country}
              </span>
            </div>
          </div>
          <div className="social flex gap-3 my-10 p-2 pr-7">
            {/* Social icons now link to editable state */}
            <a href={socialLinks.facebook || '#'} target="_blank" rel="noopener noreferrer">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xNCAxMy41aDIuNWwxLTRIMTR2LTJjMC0xLjAzIDAtMiAyLTJoMS41VjIuMTRjLS4zMjYtLjA0My0xLjU1Ny0uMTQtMi44NTctLjE0QzExLjkyOCAyIDEwIDMuNjU3IDEwIDYuN3YyLjhIN3Y0aDNWMjJoNHoiLz48L3N2Zz4="
                className='border hover:invert-75 h-10 rounded-full w-10 p-1 mt-2 invert-50'
                alt="Facebook"
              />
            </a>
            <a href={socialLinks.twitter || '#'} target="_blank" rel="noopener noreferrer">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij48ZyBmaWxsPSJub25lIj48ZyBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMS4wMjUuNjU2aDIuMTQ3TDguNDgyIDYuMDNMMTQgMTMuMzQ0SDkuNjhMNi4yOTQgOC45MDlsLTMuODcgNC40MzVILjI3NWw1LjAxNi01Ljc1TDAgLjY1N2g0LjQzTDcuNDg2IDQuNzF6bS0uNzU1IDExLjRoMS4xOUwzLjc4IDEuODc3SDIuNTA0eiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9IlNWR0cxT3Q0Y0FEIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE0djE0SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9nPjwvc3ZnPg=="
                className='border hover:invert-75 h-10 rounded-full w-10 p-1 mt-2 invert-50'
                alt="X"
              />
            </a>
            <a href={socialLinks.linkedin || '#'} target="_blank" rel="noopener noreferrer">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjUxIDguNzk2djEuNjk3YTMuNzQgMy43NCAwIDAgMSAzLjI4OC0xLjY4NGMzLjQ1NSAwIDQuMjAyIDIuMTYgNC4yMDIgNC45N1YxOS41aC0zLjJ2LTUuMDcyYzAtMS4yMS0uMjQ0LTIuNzY2LTIuMTI4LTIuNzY2Yy0xLjgyNyAwLTIuMTM5IDEuMzE3LTIuMTM5IDIuNjc2VjE5LjVoLTMuMTlWOC43OTZoMy4xNjhaTTcuMiA2LjEwNmExLjYxIDEuNjEgMCAwIDEtLjk4OCAxLjQ4M2ExLjU5NSAxLjU5NSAwIDAgMS0xLjc0My0uMzQ4QTEuNjA3IDEuNjA3IDAgMCAxIDUuNiA0LjVhMS42IDEuNiAwIDAgMSAxLjYgMS42MDYiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik03LjIgOC44MDlINFYxOS41aDMuMnoiLz48L2c+PC9zdmc+"
                className='border hover:invert-75 h-10 rounded-full w-10 p-1 mt-2 invert-50'
                alt="LinkedIn"
              />
            </a>
            <a href={socialLinks.instagram || '#'} target="_blank" rel="noopener noreferrer">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMiA4Ljc1YTMuMjUgMy4yNSAwIDEgMCAwIDYuNWEzLjI1IDMuMjUgMCAwIDAgMC02LjUiLz48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTYuNzcgMy4wODJhNDcuNSA0Ny41IDAgMCAxIDEwLjQ2IDBjMS44OTkuMjEyIDMuNDMgMS43MDcgMy42NTMgMy42MTNhNDUuNyA0NS43IDAgMCAxIDAgMTAuNjFjLS4yMjMgMS45MDYtMS43NTQgMy40MDEtMy42NTIgMy42MTRhNDcuNSA0Ny41IDAgMCAxLTEwLjQ2MSAwYy0xLjg5OS0uMjEzLTMuNDMtMS43MDgtMy42NTMtMy42MTNhNDUuNyA0NS43IDAgMCAxIDAtMTAuNjExQzMuMzQgNC43ODkgNC44NzEgMy4yOTQgNi43NyAzLjA4Mk0xNyA2YTEgMSAwIDEgMCAwIDJhMSAxIDAgMCAwIDAtMm0tOS43NSA2YTQuNzUgNC43NSAwIDEgMSA5LjUgMGE0Ljc1IDQuNzUgMCAwIDEtOS41IDAiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg=="
                className='border hover:invert-75 h-10 rounded-full w-10 p-1 mt-2 invert-50'
                alt="Instagram"
              />
            </a>
            <a href={socialLinks.github || '#'} target="_blank" rel="noopener noreferrer">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJjMCA0LjQyIDIuODcgOC4xNyA2Ljg0IDkuNWMuNS4wOC42Ni0uMjMuNjYtLjV2LTEuNjljLTIuNzcuNi0zLjM2LTEuMzQtMy4zNi0xLjM0Yy0uNDYtMS4xNi0xLjExLTEuNDctMS4xMS0xLjQ3Yy0uOTEtLjYyLjA3LS42LjA3LS42YzEgLjA3IDEuNTMgMS4wMyAxLjUzIDEuMDNjLjg3IDEuNTIgMi4zNCAxLjA3IDIuOTEuODNjLjA5LS42NS4zNS0xLjA5LjYzLTEuMzRjLTIuMjItLjI1LTQuNTUtMS4xMS00LjU1LTQuOTJjMC0xLjExLjM4LTIgMS4wMy0yLjcxYy0uMS0uMjUtLjQ1LTEuMjkuMS0yLjY0YzAgMCAuODQtLjI3IDIuNzUgMS4wMmMuNzktLjIyIDEuNjUtLjMzIDIuNS0uMzNzMS43MS4xMSAyLjUuMzNjMS45MS0xLjI5IDIuNzUtMS4wMiAyLjc1LTEuMDJjLjU1IDEuMzUuMiAyLjM5LjEgMi42NGMuNjUuNzEgMS4wMyAxLjYgMS4wMyAyLjcxYzAgMy44Mi0yLjM0IDQuNjYtNC41NyA0LjkxYy4zNi4zMS42OS45Mi42OSAxLjg1VjIxYzAgLjI3LjE2LjU5LjY3LjVDMTkuMTQgMjAuMTYgMjIgMTYuNDIgMjIgMTJBMTAgMTAgMCAwIDAgMTIuMiA2IiBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIi8+PC9zdmc+" alt="GitHub"
                className='border hover:invert-75 h-10 rounded-full w-10 p-1 mt-2 invert-50'
              />
            </a>
            <a href={socialLinks.youtube || '#'} target="_blank" rel="noopener noreferrer">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Im0xMCAxNWw1LjE5LTNMMTAgOXptMTEuNTYtNy44M2MuMTMuNDcuMjIgMS4xLjI4IDEuOWMuMDcuOC4xIDEuNDkuMSAyLjA5TDIyIDEyYzAgMi4xOS0uMTYgMy44LS40NCA0LjgzYy0uMjUuOS0uODMgMS40OC0xLjczIDEuNzNjLS40Ny4xMy0xLjMzLjIyLTIuNjUuMjhjLTEuMy4wNy0yLjQ5LjEtMy41OS4xTDEyIDE5Yy00LjE5IDAtNi44LS4xNi03LjgzLS40NGMtLjktLjI1LTEuNDgtLjgzLTEuNzMtMS43M2MtLjEzLS40Ny0uMjItMS4xLS4yOC0xLjljLS4wNy0uOC0uMS0xLjQ5LS4xLTIuMDlMMiAxMmMwLTIuMTkuMTYtMy44LjQ0LTQuODNjLjI1LS45LjgzLTEuNDggMS43My0xLjczYy40Ny0uMTMgMS4zMy0uMjIgMi42NS0uMjhjMS4zLS4wNyAyLjQ5LS4xIDMuNTktLjFMMTIgNWM0LjE5IDAgNi44LjE2IDcuODMuNDRjLjkuMjUgMS40OC44MyAxLjczIDEuNzMiLz48L3N2Zz4="
                className='border hover:invert-75 h-10 rounded-full w-10 p-1 mt-2 invert-50'
                alt="YouTube"
              />
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className='flex pl-2 pr-4 pt-2 mt-1 bg-slate-800 text-slate-400 border rounded-full hover:bg-slate-700 hover:text-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8" strokeWidth="1" /></svg>
              Edit
            </button>
            {isModalOpen && (
              <Social
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialLinks={socialLinks}
                onSave={setSocialLinks}
                username={personalInfo.email}
              />
            )}
          </div>
        </div>

        <div className='p-8 border-2 border-slate-800 rounded-xl'>
          <h2 className='font-bold text-lg px-2 pb-5'>Personal Information</h2>
          <div className='name flex justify-between w-1/2 pb-10'>
            <div className="firstName flex flex-col gap-3 px-2 w-1/2">
              <span className='text-xs font-medium text-slate-400'>First Name</span>
              <span>{personalInfo.firstName}</span>
            </div>
            <div className="lastName flex flex-col gap-3 px-2 w-1/2">
              <span className='text-xs font-medium text-slate-400'>Last Name</span>
              <span>{personalInfo.lastName}</span>
            </div>
          </div>
          <div className='mailNumber flex justify-between w-1/2 pb-10'>
            <div className="mail flex flex-col gap-3 px-2 w-1/2">
              <span className='text-xs font-medium text-slate-400'>Email Address</span>
              <span>{personalInfo.email}</span>
            </div>
            <div className="phone flex flex-col gap-3 px-2 w-1/2">
              <span className='text-xs font-medium text-slate-400'>Phone</span>
              <span>{personalInfo.phone}</span>
            </div>
          </div>
          <div className='mailNumber flex justify-between w-1/2'>
            <div className="mail flex flex-col gap-3 px-2 w-1/2">
              <span className='text-xs font-medium text-slate-400'>Bio</span>
              <span>{personalInfo.bio}</span>
            </div>
          </div>
          <div className='flex justify-between'>
            <span></span>
            <button
              onClick={() => setIsPersonalOpen(true)}
              className='flex border pl-2 pr-4 py-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8" strokeWidth="1" /></svg>
              Edit
            </button>
          </div>
          {isPersonalOpen && (
            <PersonalInfoModal
              isOpen={isPersonalOpen}
              onClose={() => setIsPersonalOpen(false)}
              initialData={personalInfo}
              onSave={setPersonalInfo}
              username={personalInfo.email}
            />
          )}
        </div>

        <div className='p-8 border-2 border-slate-800 rounded-xl'>
          <h2 className='font-bold text-lg px-2 pb-5'>Address</h2>
          <div className='address flex justify-between w-1/2 pb-10'>
            <div className="country flex flex-col gap-3 px-2 w-1/2">
              <span className='text-xs font-medium text-slate-400'>Country</span>
              <span>{address.country}</span>
            </div>
            <div className="city_state flex flex-col gap-3 px-2 w-1/2">
              <span className='text-xs font-medium text-slate-400'>City/State</span>
              <span>{address.cityState}</span>
            </div>
          </div>
          <div className='postalCode flex justify-between w-1/2'>
            <div className="postal flex flex-col gap-3 px-2 w-1/2">
              <span className='text-xs font-medium text-slate-400'>Postal Code</span>
              <span>{address.postalCode}</span>
            </div>
          </div>
          <div className='flex justify-between'>
            <span></span>
            <button
              onClick={() => setIsAddressOpen(true)}
              className='flex border pl-2 pr-4 py-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8" strokeWidth="1" /></svg>
              Edit
            </button>
          </div>
          {isAddressOpen && (
            <AddressModal
              isOpen={isAddressOpen}
              onClose={() => setIsAddressOpen(false)}
              initialData={address}
              onSave={setAddress}
              username={personalInfo.email}
            />
          )}
        </div>
        <div className='p-8 border-2 border-slate-800 rounded-xl'>
          <h2 className='font-bold text-lg px-2 pb-5'>Payment Information</h2>
          <div className='address flex justify-between pb-10'>
            <div className="country flex flex-col gap-2 px-2">
              <span className='text-xs font-medium text-slate-400'>Publishable Key</span>
              <div className='flex items-center gap-2'>
                <code className='px-2 py-1 text-slate-200'>
                  {maskKey(paymentInfo.publishableKey, 8)}
                </code>
                <button
                  onClick={() => handleCopy(paymentInfo.publishableKey, 'pk')}
                  className='text-xs text-slate-500 px-2 py-1'
                  title='Copy publishable key'
                >
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xNS4yNCAyaC0zLjg5NGMtMS43NjQgMC0zLjE2MiAwLTQuMjU1LjE0OGMtMS4xMjYuMTUyLTIuMDM3LjQ3Mi0yLjc1NSAxLjE5M2MtLjcxOS43MjEtMS4wMzggMS42MzYtMS4xODkgMi43NjZDMyA3LjIwNSAzIDguNjA4IDMgMTAuMzc5djUuODM4YzAgMS41MDguOTIgMi44IDIuMjI3IDMuMzQyYy0uMDY3LS45MS0uMDY3LTIuMTg1LS4wNjctMy4yNDd2LTUuMDFjMC0xLjI4MSAwLTIuMzg2LjExOC0zLjI3Yy4xMjctLjk0OC40MTMtMS44NTYgMS4xNDctMi41OTNzMS42MzktMS4wMjQgMi41ODMtMS4xNTJjLjg4LS4xMTggMS45OC0uMTE4IDMuMjU3LS4xMThoMy4wN2MxLjI3NiAwIDIuMzc0IDAgMy4yNTUuMTE4QTMuNiAzLjYgMCAwIDAgMTUuMjQgMiIvPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTYuNiAxMS4zOTdjMC0yLjcyNiAwLTQuMDg5Ljg0NC00LjkzNmMuODQzLS44NDcgMi4yLS44NDcgNC45MTYtLjg0N2gyLjg4YzIuNzE1IDAgNC4wNzMgMCA0LjkxNy44NDdTMjEgOC42NzEgMjEgMTEuMzk3djQuODJjMCAyLjcyNiAwIDQuMDg5LS44NDMgNC45MzZjLS44NDQuODQ3LTIuMjAyLjg0Ny00LjkxNy44NDdoLTIuODhjLTIuNzE1IDAtNC4wNzMgMC00LjkxNi0uODQ3Yy0uODQ0LS44NDctLjg0NC0yLjIxLS44NDQtNC45MzZ6Ii8+PC9zdmc+" alt="copy" className='invert-75 hover:invert-50' />
                </button>
              </div>
              {copyStatus.pk && <span className='text-xs text-green-400'>{copyStatus.pk}</span>}
            </div>
          </div>
          <div className='flex justify-between'>
            <span></span>
            <button
              onClick={() => setIsPaymentOpen(true)}
              className='flex border pl-2 pr-4 py-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8" strokeWidth="1" /></svg>
              Edit
            </button>
          </div>
          {isPaymentOpen && (
            <PaymentInfoModal
              isOpen={isPaymentOpen}
              onClose={() => setIsPaymentOpen(false)}
              initialData={paymentInfo}
              onSave={setPaymentInfo}
              username={personalInfo.email}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard