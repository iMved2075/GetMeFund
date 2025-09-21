import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-gray-900 text-white h-13 flex items-center justify-center'>
      <p className='text-center italic'>Copyright &copy; {currentYear} GetMeFund. All rights reserved.</p>
    </footer>
  )
}

export default Footer
