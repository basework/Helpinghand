"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("tivexx9ja-user") ||
        localStorage.getItem("tivexx-user") ||
        localStorage.getItem("momo-credit-user") ||
        localStorage.getItem("tivexx-user-old")

      if (stored) {
        setUserData(JSON.parse(stored))
      } else {
        setUserData(null)
      }
    } catch (e) {
      setUserData(null)
    } finally {
      setLoaded(true)
    }
  }, [])

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
            Sign in to access the full About page and learn how Helping Hands helps thousands of Nigerians earn, grow and withdraw without fees.
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
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black text-white animate-page-bounce">
      
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

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight animate-glow">Helping Hands</h1>
          <p className="text-sm text-green-100 mt-2">Nigeria's most reliable earning and financial empowerment platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">

            {/* Mission */}
            <Card className="p-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-lg animate-fade-up animate-inner-bounce">
              <h2 className="text-xl font-bold text-emerald-200 mb-2 animate-inner-bounce-child delay-0">Our Mission</h2>
              <p className="text-sm text-white/80 leading-relaxed animate-inner-bounce-child delay-1">
                Helping Hands was created to empower Nigerians with real earning opportunities, fast withdrawals and trusted digital services. 
                Our system helps users support their families, grow their hustle, fund education and improve their financial life.
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white/4 border border-white/8 text-center">
                  <div className="text-xs text-white/70">Active Users</div>
                  <div className="text-2xl font-bold text-amber-300">100,000+</div>
                </div>
                <div className="p-3 rounded-lg bg-white/4 border border-white/8 text-center">
                  <div className="text-xs text-white/70">Total Payouts</div>
                  <div className="text-2xl font-bold text-emerald-300">Millions</div>
                </div>
                <div className="p-3 rounded-lg bg-white/4 border border-white/8 text-center">
                  <div className="text-xs text-white/70">Support</div>
                  <div className="text-2xl font-bold text-purple-300">24/7</div>
                </div>
              </div>
            </Card>

            {/* NEW SECTION YOU REQUESTED */}
            <Card className="p-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-lg animate-fade-up animate-inner-bounce">
              <h2 className="text-xl font-bold text-emerald-200 mb-3 animate-inner-bounce-child delay-2">What You Can Do on Helping Hands</h2>

              <ul className="space-y-3 text-sm text-white/85 leading-relaxed list-disc pl-5 animate-inner-bounce-child delay-3">
                <li>Earn ₦1,000. every 1 minute by claiming through the daily earnings button.</li>
                <li>Earn ₦10,000 per verified referral with no limits. Some users earn from 50 to 300 referrals.</li>
                <li>Access Quick Loans instantly with no collateral or BVN required.</li>
                <li>Apply for Business Loans from ₦500,000 to ₦5,000,000 with a 3 percent processing fee and 12 months repayment.</li>
                <li>Earn through tasks, referrals, bonuses and performance rewards.</li>
                <li>Withdrawals remain 100 percent free forever.</li>
              </ul>
            </Card>

            {/* Why trust Tivexx */}
            <Card className="p-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-lg animate-fade-up">
              <h3 className="text-lg font-bold mb-2">Why Nigerians Trust Helping Hands</h3>
              <ul className="text-sm text-white/80 space-y-2 list-disc pl-5">
                <li>No hidden charges and no withdrawal fees.</li>
                <li>Super fast customer support through Telegram.</li>
                <li>Identity and anti-fraud systems that protect users.</li>
                <li>Built specifically for Nigerian users' needs.</li>
              </ul>
            </Card>

            {/* Impact Stories */}
            <Card className="p-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-lg animate-fade-up">
              <h3 className="text-lg font-bold mb-3">Impact Across Nigeria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="font-semibold">Education Support</div>
                  <div className="text-sm text-white/75 mt-1">Students used Helping Hands earnings to continue school.</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="font-semibold">Business Support</div>
                  <div className="text-sm text-white/75 mt-1">Small business owners expanded their capital through earnings.</div>
                </div>
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-6">

            <Card className="p-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-lg text-center animate-fade-up animate-inner-bounce">
              <div className="text-sm text-white/80 mb-2">Official Notice</div>
              <div className="text-xl font-bold text-amber-300">Verified Platform</div>
              <p className="text-xs text-white/70 mt-2 animate-inner-bounce-child delay-0">
                Helping Hands strictly follows identity checks and fraud prevention systems to protect all users and ensure transparent earnings.
              </p>

              <div className="mt-4 space-y-3">
                <Button
                  onClick={() => window.open("https://t.me/tivexx9jasupport", "_blank")}
                  className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-green-600 text-white animate-inner-bounce-child delay-1"
                >
                  Contact Support
                </Button>

                <Button
                  onClick={() => window.open("https://t.me/Tivexx9jacommunity", "_blank")}
                  className="w-full bg-amber-400 text-black animate-inner-bounce-child delay-2"
                >
                  Join Community Channel
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 border border-white/8 shadow-lg text-xs">
              <div className="font-semibold text-white/80">Our Promise</div>
              <p className="text-white/70 mt-2">
                Withdrawals will remain free forever,. Helping Hands will always ensure your balance is protected and paid.
              </p>
            </Card>
          </aside>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-white/60 mt-10">
          Helping Hands © {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes glow {
          0% { text-shadow: 0 0 6px rgba(16,185,129,0.06); }
          50% { text-shadow: 0 0 12px rgba(139,92,246,0.10); }
          100% { text-shadow: 0 0 6px rgba(16,185,129,0.06); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.6s ease forwards; }

        /* Page-wide gentle bounce */
        @keyframes gentleBouncePage { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-page-bounce { animation: gentleBouncePage 1.6s ease-in-out infinite; }

        /* Subtle inner bounce for cards and their children */
        @keyframes gentleBounceInner { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-inner-bounce { animation: gentleBounceInner 1.8s ease-in-out infinite; }
        .animate-inner-bounce-child { animation: gentleBounceInner 1.8s ease-in-out infinite; }

        /* Staggered delays for an organic look */
        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }
      `}</style>
    </div>
  )
}