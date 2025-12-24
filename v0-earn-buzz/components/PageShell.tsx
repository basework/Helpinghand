"use client"

import React from "react"
import { usePathname } from "next/navigation"
import SiteBackground from "@/components/ui/SiteBackground"

type PageShellProps = {
  children: React.ReactNode
  exclude?: string[]
}

export default function PageShell({ children, exclude = [] }: PageShellProps) {
  const pathname = usePathname?.() || ""
  if (exclude.some((p) => pathname.startsWith(p))) return <>{children}</>

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-black">
      {/* Unified site background component (excludes dashboard via PageShell prop in layout) */}
      <SiteBackground />

      {/* content */}
      <div className="relative z-10" style={{ color: "#3e0404ff" }}>{children}</div>
    </div>
  )
}
