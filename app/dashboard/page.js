"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import Social from '@/components/Social'
import PersonalInfoModal from '@/components/PersonalInfoModal'
import AddressModal from '@/components/AddressModal'
import { fetchuser } from '@/actions/useractions'
import PaymentInfoModal from '@/components/PayemntInfoModal'
import ProfilePicModal from '@/components/ProfilePicModal'
import { toast } from 'react-toastify'


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

  const [profilePicLinks, setProfilePicLinks] = useState({});

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
              <span className='md:inline hidden role text-slate-400'>
                {personalInfo.role} | {address.country}
              </span>
              <span className='md:hidden inline role text-slate-400 text-sm'>
                {personalInfo.role} {address.country}
              </span>
            </div>
          </div>
          <div className="social md:flex hidden gap-3 my-10 p-2 pr-7">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition mt-1">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xNCAxMy41aDIuNWwxLTRIMTR2LTJjMC0xLjAzIDAtMiAyLTJoMS41VjIuMTRjLS4zMjYtLjA0My0xLjU1Ny0uMTQtMi44NTctLjE0QzExLjkyOCAyIDEwIDMuNjU3IDEwIDYuN3YyLjhIN3Y0aDNWMjJoNHoiLz48L3N2Zz4=" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="Facebook" />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition mt-1">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij48ZyBmaWxsPSJub25lIj48ZyBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMS4wMjUuNjU2aDIuMTQ3TDguNDgyIDYuMDNMMTQgMTMuMzQ0SDkuNjhMNi4yOTQgOC45MDlsLTMuODcgNC40MzVILjI3NWw1LjAxNi01Ljc1TDAgLjY1N2g0LjQzTDcuNDg2IDQuNzF6bS0uNzU1IDExLjRoMS4xOUwzLjc4IDEuODc3SDIuNTA0eiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9IlNWR0cxT3Q0Y0FEIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE0djE0SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9nPjwvc3ZnPg==" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="X" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition mt-1">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjUxIDguNzk2djEuNjk3YTMuNzQgMy43NCAwIDAgMSAzLjI4OC0xLjY4NGMzLjQ1NSAwIDQuMjAyIDIuMTYgNC4yMDIgNC45N1YxOS41aC0zLjJ2LTUuMDcyYzAtMS4yMS0uMjQ0LTIuNzY2LTIuMTI4LTIuNzY2Yy0xLjgyNyAwLTIuMTM5IDEuMzE3LTIuMTM5IDIuNjc2VjE5LjVoLTMuMTlWOC43OTZoMy4xNjhaTTcuMiA2LjEwNmExLjYxIDEuNjEgMCAwIDEtLjk4OCAxLjQ4M2ExLjU5NSAxLjU5NSAwIDAgMS0xLjc0My0uMzQ4QTEuNjA3IDEuNjA3IDAgMCAxIDUuNiA0LjVhMS42IDEuNiAwIDAgMSAxLjYgMS42MDYiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik03LjIgOC44MDlINFYxOS41aDMuMnoiLz48L2c+PC9zdmc+" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="LinkedIn" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition mt-1">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJtMTIuNTkzIDIzLjI1OGwtLjAxMS4wMDJsLS4wNzEuMDM1bC0uMDIuMDA0bC0uMDE0LS4wMDRsLS4wNzEtLjAzNXEtLjAxNi0uMDA1LS4wMjQuMDA1bC0uMDA0LjAxbC0uMDE3LjQyOGwuMDA1LjAybC4wMS4wMTNsLjEwNC4wNzRsLjAxNS4wMDRsLjAxMi0uMDA0bC4xMDQtLjA3NGwuMDEyLS4wMTZsLjAwNC0uMDE3bC0uMDE3LS40MjdxLS4wMDQtLjAxNi0uMDE3LS4wMThtLjI2NS0uMTEzbC0uMDEzLjAwMmwtLjE4NS4wOTNsLS4wMS4wMWwtLjAwMy4wMTFsLjAxOC40M2wuMDA1LjAxMmwuMDA4LjAwN2wuMjAxLjA5M3EuMDE5LjAwNS4wMjktLjAwOGwuMDA0LS4wMTRsLS4wMzQtLjYxNHEtLjAwNS0uMDE4LS4wMi0uMDIybS0uNzE1LjAwMmEuMDIuMDIgMCAwIDAtLjAyNy4wMDZsLS4wMDYuMDE0bC0uMDM0LjYxNHEuMDAxLjAxOC4wMTcuMDI0bC4wMTUtLjAwMmwuMjAxLS4wOTNsLjAxLS4wMDhsLjAwNC0uMDExbC4wMTctLjQzbC0uMDAzLS4wMTJsLS4wMS0uMDF6Ii8+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTYgM2E1IDUgMCAwIDEgNSA1djhhNSA1IDAgMCAxLTUgNUg4YTUgNSAwIDAgMS01LTVWOGE1IDUgMCAwIDEgNS01em0tNCA1YTQgNCAwIDEgMCAwIDhhNCA0IDAgMCAwIDAtOG0wIDJhMiAyIDAgMSAxIDAgNGEyIDIgMCAwIDEgMC00bTQuNS0zLjVhMSAxIDAgMSAwIDAgMmExIDEgMCAwIDAgMC0yIi8+PC9nPjwvc3ZnPg==" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="Instagram" />
              </a>
            )}
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition mt-1">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJjMCA0LjQyIDIuODcgOC4xNyA2Ljg0IDkuNWMuNS4wOC42Ni0uMjMuNjYtLjV2LTEuNjljLTIuNzcuNi0zLjM2LTEuMzQtMy4zNi0xLjM0Yy0uNDYtMS4xNi0xLjExLTEuNDctMS4xMS0xLjQ3Yy0uOTEtLjYyLjA3LS42LjA3LS42YzEgLjA3IDEuNTMgMS4wMyAxLjUzIDEuMDNjLjg3IDEuNTIgMi4zNCAxLjA3IDIuOTEuODNjLjA5LS42NS4zNS0xLjA5LjYzLTEuMzRjLTIuMjItLjI1LTQuNTUtMS4xMS00LjU1LTQuOTJjMC0xLjExLjM4LTIgMS4wMy0yLjcxYy0uMS0uMjUtLjQ1LTEuMjkuMS0yLjY0YzAgMCAuODQtLjI3IDIuNzUgMS4wMmMuNzktLjIyIDEuNjUtLjMzIDIuNS0uMzNzMS43MS4xMSAyLjUuMzNjMS45MS0xLjI5IDIuNzUtMS4wMiAyLjc1LTEuMDJjLjU1IDEuMzUuMiAyLjM5LjEgMi42NGMuNjUuNzEgMS4wMyAxLjYgMS4wMyAyLjcxYzAgMy44Mi0yLjM0IDQuNjYtNC41NyA0LjkxYy4zNi4zMS42OS45Mi42OSAxLjg1VjIxYzAgLjI3LjE2LjU5LjY3LjVDMTkuMTQgMjAuMTYgMjIgMTYuNDIgMjIgMTJBMTAgMTAgMCAwIDAgMTIuMiA2IiBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIi8+PC9zdmc+" alt="GitHub" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" />
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition mt-1">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Im0xMCAxNWw1LjE5LTNMMTAgOXptMTEuNTYtNy44M2MuMTMuNDcuMjIgMS4xLjI4IDEuOWMuMDcuOC4xIDEuNDkuMSAyLjA5TDIyIDEyYzAgMi4xOS0uMTYgMy44LS40NCA0LjgzYy0uMjUuOS0uODMgMS40OC0xLjczIDEuNzNjLS40Ny4xMy0xLjMzLjIyLTIuNjUuMjhjLTEuMy4wNy0yLjQ5LjEtMy41OS4xTDEyIDE5Yy00LjE5IDAtNi44LS4xNi03LjgzLS40NGMtLjktLjI1LTEuNDgtLjgzLTEuNzMtMS43M2MtLjEzLS40Ny0uMjItMS4xLS4yOC0xLjljLS4wNy0uOC0uMS0xLjQ5LS4xLTIuMDlMMiAxMmMwLTIuMTkuMTYtMy44LjQ0LTQuODNjLjI1LS45LjgzLTEuNDggMS43My0xLjczYy40Ny0uMTMgMS4zMy0uMjIgMi42NS0uMjhjMS4zLS4wNyAyLjQ5LS4xIDMuNTktLjFMMTIgNWM0LjE5IDAgNi44LjE2IDcuODMuNDRjLjkuMjUgMS40OC44MyAxLjczIDEuNzMiLz48L3N2Zz4=" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="YouTube" />
              </a>
            )}
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
        <div className="social md:hidden flex gap-3 p-2 border-2 border-slate-800 rounded-xl">
          {/* Social icons now link to editable state */}
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xNCAxMy41aDIuNWwxLTRIMTR2LTJjMC0xLjAzIDAtMiAyLTJoMS41VjIuMTRjLS4zMjYtLjA0My0xLjU1Ny0uMTQtMi44NTctLjE0QzExLjkyOCAyIDEwIDMuNjU3IDEwIDYuN3YyLjhIN3Y0aDNWMjJoNHoiLz48L3N2Zz4=" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="Facebook" />
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij48ZyBmaWxsPSJub25lIj48ZyBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMS4wMjUuNjU2aDIuMTQ3TDguNDgyIDYuMDNMMTQgMTMuMzQ0SDkuNjhMNi4yOTQgOC45MDlsLTMuODcgNC40MzVILjI3NWw1LjAxNi01Ljc1TDAgLjY1N2g0LjQzTDcuNDg2IDQuNzF6bS0uNzU1IDExLjRoMS4xOUwzLjc4IDEuODc3SDIuNTA0eiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9IlNWR0cxT3Q0Y0FEIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE0djE0SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9nPjwvc3ZnPg==" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="X" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjUxIDguNzk2djEuNjk3YTMuNzQgMy43NCAwIDAgMSAzLjI4OC0xLjY4NGMzLjQ1NSAwIDQuMjAyIDIuMTYgNC4yMDIgNC45N1YxOS41aC0zLjJ2LTUuMDcyYzAtMS4yMS0uMjQ0LTIuNzY2LTIuMTI4LTIuNzY2Yy0xLjgyNyAwLTIuMTM5IDEuMzE3LTIuMTM5IDIuNjc2VjE5LjVoLTMuMTlWOC43OTZoMy4xNjhaTTcuMiA2LjEwNmExLjYxIDEuNjEgMCAwIDEtLjk4OCAxLjQ4M2ExLjU5NSAxLjU5NSAwIDAgMS0xLjc0My0uMzQ4QTEuNjA3IDEuNjA3IDAgMCAxIDUuNiA0LjVhMS42IDEuNiAwIDAgMSAxLjYgMS42MDYiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik03LjIgOC44MDlINFYxOS41aDMuMnoiLz48L2c+PC9zdmc+" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="LinkedIn" />
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJtMTIuNTkzIDIzLjI1OGwtLjAxMS4wMDJsLS4wNzEuMDM1bC0uMDIuMDA0bC0uMDE0LS4wMDRsLS4wNzEtLjAzNXEtLjAxNi0uMDA1LS4wMjQuMDA1bC0uMDA0LjAxbC0uMDE3LjQyOGwuMDA1LjAybC4wMS4wMTNsLjEwNC4wNzRsLjAxNS4wMDRsLjAxMi0uMDA0bC4xMDQtLjA3NGwuMDEyLS4wMTZsLjAwNC0uMDE3bC0uMDE3LS40MjdxLS4wMDQtLjAxNi0uMDE3LS4wMThtLjI2NS0uMTEzbC0uMDEzLjAwMmwtLjE4NS4wOTNsLS4wMS4wMWwtLjAwMy4wMTFsLjAxOC40M2wuMDA1LjAxMmwuMDA4LjAwN2wuMjAxLjA5M3EuMDE5LjAwNS4wMjktLjAwOGwuMDA0LS4wMTRsLS4wMzQtLjYxNHEtLjAwNS0uMDE4LS4wMi0uMDIybS0uNzE1LjAwMmEuMDIuMDIgMCAwIDAtLjAyNy4wMDZsLS4wMDYuMDE0bC0uMDM0LjYxNHEuMDAxLjAxOC4wMTcuMDI0bC4wMTUtLjAwMmwuMjAxLS4wOTNsLjAxLS4wMDhsLjAwNC0uMDExbC4wMTctLjQzbC0uMDAzLS4wMTJsLS4wMS0uMDF6Ii8+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTYgM2E1IDUgMCAwIDEgNSA1djhhNSA1IDAgMCAxLTUgNUg4YTUgNSAwIDAgMS01LTVWOGE1IDUgMCAwIDEgNS01em0tNCA1YTQgNCAwIDEgMCAwIDhhNCA0IDAgMCAwIDAtOG0wIDJhMiAyIDAgMSAxIDAgNGEyIDIgMCAwIDEgMC00bTQuNS0zLjVhMSAxIDAgMSAwIDAgMmExIDEgMCAwIDAgMC0yIi8+PC9nPjwvc3ZnPg==" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="Instagram" />
            </a>
          )}
          {socialLinks.github && (
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJjMCA0LjQyIDIuODcgOC4xNyA2Ljg0IDkuNWMuNS4wOC42Ni0uMjMuNjYtLjV2LTEuNjljLTIuNzcuNi0zLjM2LTEuMzQtMy4zNi0xLjM0Yy0uNDYtMS4xNi0xLjExLTEuNDctMS4xMS0xLjQ3Yy0uOTEtLjYyLjA3LS42LjA3LS42YzEgLjA3IDEuNTMgMS4wMyAxLjUzIDEuMDNjLjg3IDEuNTIgMi4zNCAxLjA3IDIuOTEuODNjLjA5LS42NS4zNS0xLjA5LjYzLTEuMzRjLTIuMjItLjI1LTQuNTUtMS4xMS00LjU1LTQuOTJjMC0xLjExLjM4LTIgMS4wMy0yLjcxYy0uMS0uMjUtLjQ1LTEuMjkuMS0yLjY0YzAgMCAuODQtLjI3IDIuNzUgMS4wMmMuNzktLjIyIDEuNjUtLjMzIDIuNS0uMzNzMS43MS4xMSAyLjUuMzNjMS45MS0xLjI5IDIuNzUtMS4wMiAyLjc1LTEuMDJjLjU1IDEuMzUuMiAyLjM5LjEgMi42NGMuNjUuNzEgMS4wMyAxLjYgMS4wMyAyLjcxYzAgMy44Mi0yLjM0IDQuNjYtNC41NyA0LjkxYy4zNi4zMS42OS45Mi42OSAxLjg1VjIxYzAgLjI3LjE2LjU5LjY3LjVDMTkuMTQgMjAuMTYgMjIgMTYuNDIgMjIgMTJBMTAgMTAgMCAwIDAgMTIuMiA2IiBjbGlwLXBhdGg9InVybCgjU1ZHRzFPdDRjQUQpIi8+PC9zdmc+" alt="GitHub" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" />
            </a>
          )}
          {socialLinks.youtube && (
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700 transition">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Im0xMCAxNWw1LjE5LTNMMTAgOXptMTEuNTYtNy44M2MuMTMuNDcuMjIgMS4xLjI4IDEuOWMuMDcuOC4xIDEuNDkuMSAyLjA5TDIyIDEyYzAgMi4xOS0uMTYgMy44LS40NCA0LjgzYy0uMjUuOS0uODMgMS40OC0xLjczIDEuNzNjLS40Ny4xMy0xLjMzLjIyLTIuNjUuMjhjLTEuMy4wNy0yLjQ5LjEtMy41OS4xTDEyIDE5Yy00LjE5IDAtNi44LS4xNi03LjgzLS40NGMtLjktLjI1LTEuNDgtLjgzLTEuNzMtMS43M2MtLjEzLS40Ny0uMjItMS4xLS4yOC0xLjljLS4wNy0uOC0uMS0xLjQ5LS4xLTIuMDlMMiAxMmMwLTIuMTkuMTYtMy44LjQ0LTQuODNjLjI1LS45LjgzLTEuNDggMS43My0xLjczYy40Ny0uMTMgMS4zMy0uMjIgMi42NS0uMjhjMS4zLS4wNyAyLjQ5LS4xIDMuNTktLjFMMTIgNWM0LjE5IDAgNi44LjE2IDcuODMuNDRjLjkuMjUgMS40OC44MyAxLjczIDEuNzMiLz48L3N2Zz4=" className="w-4 h-4 md:w-6 md:h-6 invert-50 group-hover:invert-0" alt="YouTube" />
            </a>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-400 ring-1 ring-slate-700 hover:bg-slate-700 hover:text-white transition mt-2 pr-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8" strokeWidth="1" /></svg>
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

        <div className='md:p-8 p-3 border-2 border-slate-800 rounded-xl'>
          <h2 className='font-bold text-lg px-2 pb-5'>Personal Information</h2>
          <div className='name flex md:flex-row flex-col justify-between gap-4 md:gap-0 md:w-1/2 md:pb-10 pb-3'>
            <div className="firstName flex md:flex-col flex-row md:gap-3 gap-5 px-2 md:w-1/2">
              <span className='md:inline hidden text-xs font-medium text-slate-400'>First Name</span>
              <span className='md:hidden inline font-medium text-slate-400'>First Name : {personalInfo.firstName}</span>
              <span className='md:inline hidden'>{personalInfo.firstName}</span>
            </div>
            <div className="lastName flex md:flex-col flex-row md:gap-3 gap-6 px-2 md:w-1/2">
              <span className='md:inline hidden text-xs font-medium text-slate-400'>Last Name</span>
              <span className='md:hidden inline font-medium text-slate-400'>Last Name : {personalInfo.lastName}</span>
              <span className='md:inline hidden'>{personalInfo.lastName}</span>
            </div>
          </div>
          <div className='mailNumber flex md:flex-row flex-col justify-between gap-4 md:gap-0 md:w-1/2 md:pb-10 pb-3'>
            <div className="mail flex md:flex-col flex-row md:gap-3 gap-5 px-2 md:w-1/2">
              <span className='md:inline hidden text-xs font-medium text-slate-400'>Email Address</span>
              <span className='md:hidden inline font-medium text-slate-400'>Email : {personalInfo.email}</span>
              <span className='md:inline hidden'>{personalInfo.email}</span>
            </div>
            <div className="phone flex md:flex-col flex-row md:gap-3 gap-6 px-2 md:w-1/2">
              <span className='md:inline hidden text-xs font-medium text-slate-400'>Phone</span>
              <span className='md:hidden inline font-medium text-slate-400'>Phone : {personalInfo.phone}</span>
              <span className='md:inline hidden'>{personalInfo.phone}</span>
            </div>
          </div>
          <div className='bio flex justify-between md:w-1/2 pb-3'>
            <div className="mail flex md:flex-col gap-3 px-2 md:w-1/2">
              <span className='md:inline hidden text-xs font-medium text-slate-400'>Bio</span>
              <span className='md:inline hidden'>{personalInfo.bio}</span>
              <span className='md:hidden inline font-medium text-slate-400'>Bio : {personalInfo.bio}</span>
            </div>
          </div>
          <div className='flex justify-between'>
            <span></span>
            <button
              onClick={() => setIsPersonalOpen(true)}
              className='flex border pl-2 md:pr-4 pr-2 py-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8" strokeWidth="1" /></svg>
              <span className='md:inline hidden'>Edit</span>
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

        <div className='md:p-8 p-3 border-2 border-slate-800 rounded-xl'>
          <h2 className='font-bold text-lg px-2 pb-5'>Address</h2>
          <div className='address flex md:flex-row flex-col justify-between md:w-1/2 md:pb-10 pb-3'>
            <div className="country flex flex-col gap-3 md:pb-0 pb-3 px-2 md:w-1/2">
              <span className='md:inline hidden text-xs font-medium text-slate-400'>Country</span>
              <span className='md:inline hidden'>{address.country}</span>
              <span className='md:hidden inline font-medium text-slate-400'>Country : {address.country}</span>
            </div>
            <div className="city_state flex md:flex-col flex-row gap-3 md:px-2 pl-2 pr-1 md:w-1/2">
              <span className='md:inline hidden text-xs font-medium text-slate-400'>City/State</span>
              <span className='md:inline hidden'>{address.cityState}</span>
              <span className='md:hidden inline font-medium text-slate-400'>City/State : {address.cityState}</span>
            </div>
          </div>
          <div className='postalCode flex justify-between md:w-1/2 pb-3'>
            <div className="postal flex flex-col gap-3 px-2 md:w-1/2">
              <span className='md:inline hidden text-xs font-medium text-slate-400'>Postal Code</span>
              <span className='md:inline hidden'>{address.postalCode}</span>
              <span className='md:hidden inline font-medium text-slate-400'>Postal Code : {address.postalCode}</span>
            </div>
          </div>
          <div className='flex justify-between'>
            <span></span>
            <button
              onClick={() => setIsAddressOpen(true)}
              className='flex border pl-2 md:pr-4 pr-2 py-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8" strokeWidth="1" /></svg>
              <span className='md:inline hidden'>Edit</span>
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
        <div className='md:p-8 p-3 border-2 border-slate-800 rounded-xl'>
          <h2 className='font-bold text-lg px-2 pb-5'>Payment Information</h2>
          <div className='payment flex justify-between md:pb-10 pb-3'>
            <div className="paymentInfo flex flex-col gap-2 px-2">
              <span className='md:text-xs font-medium text-slate-400'>Publishable Key</span>
              <div className='flex items-center gap-2'>
                <code className='md:px-2 py-1 text-slate-200'>
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
              className='flex border pl-2 md:pr-4 pr-2 py-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8" strokeWidth="1" /></svg>
              <span className='md:inline hidden'>Edit</span>
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
        {/* Danger zone: Delete account */}
        <div className='md:p-8 p-3 border-2 border-red-900/60 rounded-xl bg-red-950/20'>
          <h2 className='font-bold text-lg px-2 pb-3 text-red-300'>Danger zone</h2>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-2'>
            <p className='text-sm text-red-200/80'>Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button
              onClick={async () => {
                try {
                  const input = window.prompt('Type DELETE to confirm account deletion. This cannot be undone.')
                  if (input !== 'DELETE') return
                  const res = await fetch('/api/account/delete', { method: 'DELETE' })
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    throw new Error(data?.error || 'Failed to delete account')
                  }
                  toast.success('Account deleted')
                  // Give toast a moment, then sign out and redirect to home
                  setTimeout(() => signOut({ callbackUrl: '/' }), 600)
                } catch (err) {
                  console.error(err)
                  toast.error(err.message || 'Could not delete account')
                }
              }}
              className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-700/90 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/60'
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'><path fill='currentColor' d='M9 3h6a1 1 0 0 1 1 1v1h4v2h-1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7H3V5h4V4a1 1 0 0 1 1-1m2 2v1h2V5zm7 3H6v12h12zM9 10h2v8H9zm4 0h2v8h-2z' /></svg>
              Delete account
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard