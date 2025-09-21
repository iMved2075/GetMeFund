"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useState } from 'react'
import Link from 'next/link'

const Navbar = () => {
  const { data: session } = useSession()
  const [showdropdown, setshowdropdown] = useState(false)


  return (
    <nav className='bg-gray-900 text-white flex justify-between'>
      <Link href={"/"} className="logo font-bold p-3 text-2xl flex flex-row gap-2">
        <img src="./coin_bounce.gif" alt="coin_gif" width={25} height={25} />
        <span>GetMeFund!</span>
      </Link>
      <div className='pt-2 relative'>
        {session && <>
          <button id="dropdownDefaultButton" onClick={() => setshowdropdown(!showdropdown)} onBlur={() => setTimeout(() => setshowdropdown(false), 250)} data-dropdown-toggle="dropdown" className="hover:cursor-pointer md:w-44 w-10 h-10 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-full md:rounded-lg text-sm md:px-4 md:p-2 p-0 text-center me-2 mb-2 inline-flex justify-center md:justify-between items-center" type="button">
            <span className="md:inline hidden">{session.user.name}</span>
            <span className="md:hidden inline">{session.user.name.charAt(0)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="md:inline hidden" fill="none">
              <path fill="skyblue" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" /></svg>
          </button>
          <div id="dropdown" className={`z-10 ${showdropdown ? "" : "hidden"} absolute right-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link href={`${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Page</Link>
              </li>
              <li>
                <Link href="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => { signOut({ callbackUrl: '/' }) }}>Signout</Link>
              </li>
            </ul>
          </div>
        </>}

        {!session &&
          <Link href={"/login"}>
            <button className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2'>Login</button>
          </Link>}
      </div>
    </nav>
  )
}

export default Navbar
