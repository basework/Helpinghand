"use client"

import { useState, useEffect } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  const handleWhatsAppSupport = () => {
    const phoneNumber = "2349059089490"
    const message = encodeURIComponent("hello, am from Helping Hands.")
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!supabase) {
        setError("Database connection not available")
        setLoading(false)
        return
      }

      let fullUser: any = null

      // STEP 1: Try Supabase Auth login first
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (!authError && authData?.user) {
        // User exists in Supabase Auth → pull everything
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single()

        fullUser = data
      } else {
        // STEP 2: Legacy fallback — check your old users table
        const { data: localUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single()

        if (!localUser || localUser.password !== password) {
          setError("Invalid email or password")
          setLoading(false)
          return
        }

        fullUser = localUser

        // REMOVED THE signUp() LINE ON PURPOSE
        // This was giving people extra referral money on every new browser
        // No more silent migration here → referral bonus only on real register
      }

      // Save the FULL user object with correct numbers
      localStorage.setItem("tivexx-user", JSON.stringify({
        ...fullUser,
        balance: Number(fullUser?.balance || 0),
        referral_balance: Number(fullUser?.referral_balance || 0),
        referral_count: Number(fullUser?.referral_count || 0),
      }))

      router.push("/dashboard")

    } catch (err) {
      setError("Login failed")
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

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <div className="animate-bounce">
            <div className="text-center mb-6">
              <h1 className="text-5xl font-extrabold text-white mb-2 animate-glow">Helping Hands</h1>
              <p className="text-emerald-200 text-sm">Nigeria's trusted earning platform</p>
            </div>
          </div>

          <div className="w-full backdrop-blur-lg bg-white/6 border border-white/8 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-emerald-200 mb-6 animate-fade-in">
              Welcome Back
            </h2>

            {error && (
              <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-300 animate-fade-in mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-6">
              <div className="space-y-4">
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
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-semibold shadow-lg transition-all hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </span>
                ) : "Login"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/8">
              <p className="text-center text-white/80">
                Don't have an account?{" "}
                <Link href="/register" className="text-emerald-300 hover:text-emerald-200 font-semibold">
                  Register Now
                </Link>
              </p>
              <p className="text-center text-xs text-white/60 mt-2">
                Get ₦50,000 signup bonus + earn ₦10,000 per referral
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Support Button */}
      <div className="fixed bottom-6 left-6 z-20 animate-bounce-slow">
        <button
          onClick={handleWhatsAppSupport}
          className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 border border-emerald-400/30"
          aria-label="Contact WhatsApp Support"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </button>
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

        .animate-fade-in { animation: fadeIn 0.8s ease-in-out; }
        .animate-glow { animation: glow 2s infinite alternate; }
        .animate-particle { animation: particle 8s linear infinite; }
        .animate-bounce-slow { animation: bounceSlow 2s infinite alternate; }
      `}</style>
    </div>
  )
}