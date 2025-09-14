"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='bg-gray-900 text-white flex justify-between'>
      <div className="logo font-bold p-3 text-2xl flex flex-row gap-2">
        <img src="./coin_bounce.gif" alt="coin_gif" width={25} height={25} />
        <span>GetMeFund!</span>
      </div>

      {/* <ul className='flex justify-between items-center gap-10 px-3'>
        <li>Home</li>
        <li>About</li>
        <li>Projects</li>
        <li>Contact</li>
        <li>Login</li>
      </ul> */}

      <div className='pt-2'>
        <Link href={"/login"}>
          <button className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2'>Login</button>
        </Link>
      </div>

    </nav>
  )
}

export default Navbar
