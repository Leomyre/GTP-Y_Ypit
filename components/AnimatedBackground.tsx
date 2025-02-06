"use client"

import type React from "react"
import { useTheme } from "next-themes"

const AnimatedBackground: React.FC = () => {
  useTheme()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-cyan-300 to-blue-500 dark:from-sky-800 dark:via-cyan-900 dark:to-blue-950 transition-colors duration-500" />
      <div className="wave wave1" />
      <div className="wave wave2" />
      <div className="wave wave3" />
      <div className="sun" />
      <div className="palm-tree palm-tree1" />
      <div className="palm-tree palm-tree2" />
      <div className="seagull seagull1" />
      <div className="seagull seagull2" />
    </div>
  )
}

export default AnimatedBackground

