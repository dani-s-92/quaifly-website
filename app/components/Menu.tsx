'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const Menu = () => {
  const [navColor, setnavColor] = useState('transparent')
  const [shadow, setShadow] = useState('shadow-none')

  const listenScrollEvent = () => {
    if (window.scrollY > 10) {
      setnavColor('white')
      setShadow('shadow-md')
    } else {
      setnavColor('transparent')
      setShadow('shadow-none')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent)
    return () => {
      window.removeEventListener('scroll', listenScrollEvent)
    }
  }, [])

  return (
    <nav
      className={`fixed w-screen flex justify-between items-center px-4 md:px-16 lg:px-40 py-4 text-xl z-99 ${shadow}`}
      style={{
        backgroundColor: navColor,
        transition: 'all 0.5s ease-in-out',
      }}
      data-aos="fade-down"
      data-aos-duration="1000"
      data-aos-delay="200"
    >
      <Image src="/logo white.jpg" alt="QuaiFly Logo" width={60} height={60} />

      <div>
        <a
          href="#home"
          className={`px-8 py-4 relative transition-all 
            before:w-0 before:h-[2px] before:absolute before:bottom-0 before:right-0 before:transition-all before:duration-500
            hover:before:w-full hover:before:left-0 hover:before:bg-highlight`}
        >
          Home
        </a>
        <a
          href="#about"
          className={`px-8 py-4 relative transition-all 
            before:w-0 before:h-[2px] before:absolute before:bottom-0 before:right-0 before:transition-all before:duration-500
            hover:before:w-full hover:before:left-0 hover:before:bg-highlight`}
        >
          About
        </a>
      </div>
    </nav>
  )
}

export default Menu
