"use client"
import { motion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AnimatedCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Add spring physics for smooth trailing
  const cursorX = useSpring(0, { stiffness: 300, damping: 25 })
  const cursorY = useSpring(0, { stiffness: 300, damping: 25 })

  // Outer cursor with more delay
  const outerX = useSpring(0, { stiffness: 150, damping: 20 })
  const outerY = useSpring(0, { stiffness: 150, damping: 20 })

  useEffect(() => {
    // Check if device is desktop (screen width >= 1024px and has mouse)
    const checkIsDesktop = () => {
      const hasMousePointer = window.matchMedia('(pointer: fine)').matches
      const isLargeScreen = window.innerWidth >= 1024
      setIsDesktop(hasMousePointer && isLargeScreen)
    }

    // Initial check
    checkIsDesktop()

    // Listen for window resize
    window.addEventListener('resize', checkIsDesktop)

    const updateMousePosition = (e: MouseEvent) => {

      // Update spring values for trailing effect
      cursorX.set(e.clientX - 3)
      cursorY.set(e.clientY - 3)
      outerX.set(e.clientX - 16)
      outerY.set(e.clientY - 16)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer')
      setIsHovering(!!isClickable)
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('resize', checkIsDesktop)
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY, outerX, outerY])

  // Don't render cursor on mobile/tablet devices
  if (!isDesktop) {
    return null
  }

  return (
    <>
      {/* Inner cursor with trailing */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovering ? 0.8 : 1,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{
          scale: { type: "spring", stiffness: 400, damping: 20 },
          rotate: { type: "spring", stiffness: 300, damping: 15 }
        }}
      >
        <div className="w-2 h-2 rounded-full bg-blue-500 backdrop-blur-[2px] mix-blend-difference" />
      </motion.div>


      {/* Outer cursor with more trailing */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: outerX,
          y: outerY,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.9 : 0.7, // Slight opacity change
        }}
        transition={{
          scale: { type: "spring", stiffness: 200, damping: 20 },
          opacity: { duration: 0.2 }
        }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-white shadow-xl backdrop-blur-sm mix-blend-difference"
        />
      </motion.div>
    </>
  )
}