"use client"

import React from "react"

export default function SiteBackground() {
  return (
    <div className="absolute inset-0 -z-20" aria-hidden>
      {/* Primary gradient: from-green-700 via-green-900 to-black */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-900 to-black" />

      {/* Soft overlay veil to add depth and subtle green tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-green-500/10 pointer-events-none" />

      {/* Radial highlight + subtle noise/texture via SVG */}
      <svg className="absolute -z-10 opacity-20" style={{ right: "-8%", top: "-6%", width: "70%" }} viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="site-bg-rad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.06" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="300" fill="url(#site-bg-rad)" />
      </svg>
    </div>
  )
}
