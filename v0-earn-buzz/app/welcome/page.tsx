"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function WelcomePage() {
  const router = useRouter()
  const [displayText, setDisplayText] = useState("")
  const fullText = "Helping Hands"
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Typing animation
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, fullText])

  useEffect(() => {
    // Redirect to dashboard after 6 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 6000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8 font-mono">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>

        <p className="text-xl text-green-100 mb-8 animate-fade-in" style={{ animationDelay: "3s" }}>
          Financial Services
        </p>

        <div className="flex justify-center space-x-2 animate-fade-in" style={{ animationDelay: "4s" }}>
          <div className="w-3 h-3 bg-tiv-3 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bg-tiv-3 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-tiv-3 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
}
