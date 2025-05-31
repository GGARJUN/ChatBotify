"use client"
import { Button } from '@/components/ui/button'
import { CircleDotDashed } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa' // Hamburger & Close icons
import { motion } from 'framer-motion'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="flex items-center justify-between p-4 px-6 md:px-20 border-b border-gray-200 shadow-sm bg-white z-50">
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition-all duration-300">
          {/* <ImFire size={16} /> */}
          <CircleDotDashed />
          <h2 className="font-bold text-xl">Chatbotify</h2>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-14 font-semibold text-sm">
        <li className="hover:text-primary cursor-pointer transition-all duration-300">
          Features
        </li>
        <li className="hover:text-primary cursor-pointer transition-all duration-300">
          How it Works
        </li>
        <li className="hover:text-primary cursor-pointer transition-all duration-300">
          Pricing
        </li>
        <li className="hover:text-primary cursor-pointer transition-all duration-300">
          FAQ
        </li>
      </ul>

      {/* CTA Buttons */}
      <div className="flex items-center gap-5">
        <Link href="/auth/login">
          <h2 className="text-primary font-semibold cursor-pointer hidden md:block">
            Sign In
          </h2>
        </Link>
        <Link href="/auth/register">
          <Button className="cursor-pointer">Get Started</Button>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'tween' }}
          className="absolute top-16 left-0 right-0 bg-white p-6 shadow-lg flex flex-col gap-4 md:hidden z-40"
        >
          <ul className="flex flex-col gap-4 font-semibold text-base">
            <li
              className="hover:text-primary cursor-pointer transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </li>
            <li
              className="hover:text-primary cursor-pointer transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </li>
            <li
              className="hover:text-primary cursor-pointer transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </li>
            <li
              className="hover:text-primary cursor-pointer transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </li>
            <li
              className="hover:text-primary cursor-pointer transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  )
}

export default Header