"use client"

import React from "react"
import { usePathname } from "next/navigation"

type PageShellProps = {
  children: React.ReactNode
  exclude?: string[]
}

export default function PageShell({ children, exclude = [] }: PageShellProps) {
  const pathname = usePathname?.() || ""
  if (exclude.some((p) => pathname.startsWith(p))) return <>{children}</>

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-white">
      {/* Base gradient: left green -> milk -> right maroon */}
      <div className="absolute inset-0 -z-20" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-[#efe6dd] to-[#6b2b2b] opacity-95" />
        {/* Soft veil + radial highlight */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-black/20 to-transparent" />
        <svg className="absolute -z-0 opacity-10" style={{ right: "-8%", top: "-6%", width: "70%" }} viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ps-rad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#efe6dd" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#6b2b2b" stopOpacity="0.03" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="250" fill="url(#ps-rad)" />
        </svg>
      </div>

      {/* content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
