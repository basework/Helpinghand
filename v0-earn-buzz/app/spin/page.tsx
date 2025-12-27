"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SpinWheel } from "@/components/spin-wheel"

type SpinOutcome = "WIN" | "LOSE" | "TRY_AGAIN"

export default function SpinPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState<SpinOutcome | null>(null)
  const [spinsRemaining, setSpinsRemaining] = useState(0)

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("tivexx9ja-user") ||
        localStorage.getItem("tivexx-user") ||
        localStorage.getItem("momo-credit-user") ||
        localStorage.getItem("tivexx-user-old")

      if (stored) {
        const user = JSON.parse(stored)
        setUserData(user)
        // Get spins remaining from localStorage
        const savedSpins = localStorage.getItem("tivexx-spins-remaining")
        setSpinsRemaining(savedSpins ? parseInt(savedSpins) : 3)
      } else {
        setUserData(null)
      }
    } catch (e) {
      setUserData(null)
    } finally {
      setLoaded(true)
    }
  }, [])

  const handleSpin = () => {
    if (isSpinning || spinsRemaining <= 0) return

    setIsSpinning(true)
    setSpinResult(null)

    // Simulate spin result after delay
    setTimeout(() => {
      const outcomes: SpinOutcome[] = ["WIN", "LOSE", "TRY_AGAIN"]
      const result = outcomes[Math.floor(Math.random() * outcomes.length)]
      setSpinResult(result)
      setIsSpinning(false)

      // Update spins remaining
      const newSpins = spinsRemaining - 1
      setSpinsRemaining(newSpins)
      localStorage.setItem("tivexx-spins-remaining", newSpins.toString())
    }, 7000)
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-900 to-black p-6">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4" />
          <div className="text-lg font-medium">Loading Helping Hands</div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-900 to-black p-6">
        <Card className="max-w-lg w-full p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Welcome to Helping Hands</h2>
          <p className="text-sm text-gray-600">
            Sign in to access the full About page and learn how Helping Handshelps thousands of Nigerians earn, grow and withdraw without fees.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button onClick={() => router.push("/login")} className="bg-amber-400 text-black">
              Sign in
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="ghost" className="border border-white/10">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black text-white">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push("/dashboard")}
          className="p-2 rounded-md bg-white/6 hover:bg-white/10 backdrop-blur-sm flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
          <span className="text-sm">Dashboard</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold leading-tight">Daily Spin Wheel</h1>
          <p className="text-sm text-green-100 mt-2">Try your luck and win amazing rewards!</p>
        </div>

        {/* Main Spin Section */}
        <div className="space-y-6">
          {/* Spin Wheel */}
          <Card className="p-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-lg">
            <SpinWheel isSpinning={isSpinning} result={spinResult} />
          </Card>

          {/* Spins Info */}
          <div className="text-center">
            <div className="text-sm text-green-100 mb-2">Spins Remaining Today</div>
            <div className="text-5xl font-bold text-amber-300">{spinsRemaining}</div>
          </div>

          {/* Spin Button */}
          <Button
            onClick={handleSpin}
            disabled={isSpinning || spinsRemaining <= 0}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpinning ? "Spinning..." : spinsRemaining <= 0 ? "No Spins Left Today" : "SPIN THE WHEEL"}
          </Button>

          {/* Result Display */}
          {spinResult && (
            <Card className="p-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-lg text-center">
              <h3 className="text-xl font-bold mb-3">Result</h3>
              <div className={`text-4xl font-extrabold mb-3 ${
                spinResult === "WIN" ? "text-green-400" :
                spinResult === "LOSE" ? "text-red-400" :
                "text-yellow-400"
              }`}>
                {spinResult === "WIN" ? "🎉 YOU WIN!" : spinResult === "LOSE" ? "❌ TRY AGAIN" : "⏳ TRY AGAIN"}
              </div>
              <p className="text-sm text-white/80">
                {spinResult === "WIN" && "Congratulations! Reward has been added to your balance."}
                {spinResult === "LOSE" && "Better luck next time!"}
                {spinResult === "TRY_AGAIN" && "Come back tomorrow for more chances to win!"}
              </p>
            </Card>
          )}

          {/* Info Card */}
          <Card className="p-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-lg">
            <h3 className="text-lg font-bold mb-3">How It Works</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>🎯 You get 3 spins per day</li>
              <li>🎁 Win rewards, bonus credit, or try again</li>
              <li>⏰ Spins reset every 24 hours</li>
              <li>🏆 More spins available through referrals</li>
            </ul>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-white/60 mt-10">
          Helping Hands © {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </div>
  )
}