"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [showPasswordReminder, setShowPasswordReminder] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const storedUser = localStorage.getItem("tivexx-user")
    if (storedUser) {
      router.push("/dashboard")
    }
  }, [mounted, router])

  useEffect(() => {
    if (!mounted) return

    const refCode = searchParams.get("ref")
    if (refCode) {
      setReferralCode(refCode)
    }
  }, [mounted, searchParams])

  // Password reminder notification
  useEffect(() => {
    if (!mounted) return

    const showReminder = () => {
      setShowPasswordReminder(true)
      setTimeout(() => {
        setShowPasswordReminder(false)
        // Show again after 7 seconds
        setTimeout(showReminder, 7000)
      }, 2000)
    }

    // Start the reminder cycle after 3 seconds
    const initialTimer = setTimeout(showReminder, 3000)

    return () => {
      clearTimeout(initialTimer)
    }
  }, [mounted])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          referralCode: referralCode || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        balance: 100000, // Changed signup bonus to ₦100,000
        userId: data.user.referral_code,
        hasMomoNumber: false,
        level: "Basic",
        referralCode: data.user.referral_code,
      }

      localStorage.setItem("tivexx-user", JSON.stringify(userData))
      localStorage.removeItem("tivexx-welcome-popup-shown")

      router.push("/welcome")
    } catch (error: any) {
      console.error("[v0] Registration error:", error)
      setError(error.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-700 via-green-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/30 rounded-full animate-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Password Reminder Notification */}
      {showPasswordReminder && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-600/90 to-amber-600/90 text-white rounded-xl px-5 py-3 shadow-2xl border border-yellow-400/30 backdrop-blur-sm animate-password-reminder flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
              </svg>
            </div>
            <span className="text-sm font-medium">💡 Remember to use a memorable password!</span>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 animate-page-bounce">
        <div className="w-full max-w-md flex flex-col items-center gap-8 animate-inner-bounce">
          <div className="text-center mb-4 animate-fade-in animate-inner-bounce-child delay-0">
            <h1 className="text-5xl font-extrabold text-white mb-2 animate-glow">Helping Hands</h1>
            <p className="text-emerald-200 text-sm">Join thousands earning daily</p>
          </div>

          <div className="w-full backdrop-blur-lg bg-white/6 border border-white/8 rounded-2xl p-8 shadow-2xl animate-inner-bounce-child delay-1">
            <h2 className="text-2xl font-bold text-center text-emerald-200 mb-6 animate-inner-bounce-child delay-2">
              Create Your Account
            </h2>

            {referralCode && (
              <Alert className="bg-emerald-900/30 border-emerald-800/30 animate-fade-in mb-4 animate-inner-bounce-child delay-2">
                <AlertDescription className="text-emerald-300 text-center">
                  🎉 You're signing up with referral code: <strong>{referralCode}</strong>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-300 animate-fade-in mb-4 animate-inner-bounce-child delay-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister} className="w-full space-y-6 animate-inner-bounce-child delay-3">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-14 rounded-xl bg-white/10 text-white placeholder:text-white/60 px-6 border border-white/8 focus:border-emerald-400 focus:ring-emerald-400"
                />

                <Input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-xl bg-white/10 text-white placeholder:text-white/60 px-6 border border-white/8 focus:border-emerald-400 focus:ring-emerald-400"
                />

                <Input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 rounded-xl bg-white/10 text-white placeholder:text-white/60 px-6 border border-white/8 focus:border-emerald-400 focus:ring-emerald-400"
                />

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Referral Code (Auto-filled)"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    readOnly={!!searchParams.get("ref")}
                    className={`h-14 rounded-xl bg-white/10 text-white placeholder:text-white/60 px-6 border border-white/8 focus:border-emerald-400 focus:ring-emerald-400 ${
                      searchParams.get("ref") ? "cursor-not-allowed opacity-80" : ""
                    }`}
                  />
                  {searchParams.get("ref") && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-semibold shadow-lg transition-all hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : "Register & Get ₦100,000"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/8 animate-inner-bounce-child delay-4">
              <p className="text-center text-white/80">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-300 hover:text-emerald-200 font-semibold">
                  Login Now
                </Link>
              </p>
              <p className="text-center text-xs text-white/60 mt-2">
                Get instant ₦100,000 bonus + earn ₦10,000 per referral
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px rgba(16,185,129,0.5), 0 0 10px rgba(16,185,129,0.3), 0 0 20px rgba(16,185,129,0.2); }
          50% { text-shadow: 0 0 10px rgba(16,185,129,0.6), 0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.3); }
        }
        @keyframes particle {
          0% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(15px); opacity: 0.1; }
          100% { transform: translateY(0) translateX(0); opacity: 0.3; }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gentleBouncePage {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes gentleBounceInner {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes passwordReminder {
          0% {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%) scale(0.9);
          }
          15% {
            opacity: 1;
            transform: translateY(0) translateX(-50%) scale(1);
          }
          85% {
            opacity: 1;
            transform: translateY(0) translateX(-50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%) scale(0.9);
          }
        }

        .animate-fade-in { animation: fadeIn 0.8s ease-in-out; }
        .animate-glow { animation: glow 2s infinite alternate; }
        .animate-particle { animation: particle 8s linear infinite; }
        .animate-bounce-slow { animation: bounceSlow 2s infinite alternate; }
        .animate-page-bounce { animation: gentleBouncePage 1.6s ease-in-out infinite; }
        .animate-inner-bounce { animation: gentleBounceInner 1.8s ease-in-out infinite; }
        .animate-inner-bounce-child { animation: gentleBounceInner 1.8s ease-in-out infinite; }
        .animate-password-reminder { animation: passwordReminder 2s ease-in-out forwards; }

        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }

        @media (prefers-reduced-motion: reduce) {
          .animate-page-bounce,
          .animate-inner-bounce,
          .animate-inner-bounce-child,
          .animate-password-reminder {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}