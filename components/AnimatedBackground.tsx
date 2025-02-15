"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-300 to-blue-500 dark:from-sky-800 dark:via-cyan-900 dark:to-blue-950 transition-colors duration-500">
      <div className="wave wave1" />
      <div className="wave wave2" />
      <div className="wave wave3" />
      {theme === "light" ? (
        <>
          <div className="sun" />
          <div className="palm-tree palm-tree1" />
          <div className="palm-tree palm-tree2" />
          <div className="cloud cloud1" />
          <div className="cloud cloud2" />
          <div className="cloud cloud3" />
        </>
      ) : (
        <>
          <div className="moon" />
          <div className="stars" />
          <div className="shooting-star" style={{ top: "20%", left: "10%" }} />
          <div className="shooting-star" style={{ top: "50%", right: "20%" }} />
        </>
      )}
    </div>
  )
}

export default AnimatedBackground

