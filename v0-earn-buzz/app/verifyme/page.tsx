"use client"

import { ShieldCheck, ArrowRight, UserCheck, CreditCard, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerifyMePage() {
  const router = useRouter()
  const [tickVisible, setTickVisible] = useState(false)

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

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-gradient-to-br from-green-500 to-green-700 text-white overflow-y-auto py-10 px-4 animate-fade-in">
      <h1 className="text-5xl font-extrabold mb-6 text-center animate-glow flex items-center justify-center">
        Helping Hands
      </h1>

      <Card className="relative z-10 max-w-md w-full p-8 backdrop-blur-lg bg-white/10 border border-green-300 shadow-2xl rounded-2xl animate-slide-up hover:scale-[1.03] hover:shadow-xl transition-transform duration-500 overflow-hidden">
        <div className="flex flex-col items-center space-y-6 relative z-10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce-slow">
            <ShieldCheck className="h-12 w-12 text-green-200" />
          </div>

          <div className="flex items-center space-x-3 animate-slide-up relative">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Account Verification
            </h1>
            {tickVisible && (
              <CheckCircle className="h-8 w-8 text-green-400 animate-slide-in-left" />
            )}
          </div>

          <p className="text-center text-sm text-green-100 leading-relaxed max-w-xl animate-slide-up">
            To comply with <strong>CBN regulations</strong> and prevent fraudulent activity and bots,
            a <strong>mandatory verification</strong> is required. Completing verification ensures your
            withdrawals are fully protected.
          </p>

          <div className="relative w-full bg-white/5 border border-white/10 rounded-lg p-4 text-left space-y-3 flex items-center animate-slide-up">
            <CreditCard className="h-12 w-12 text-yellow-400 animate-spin-slow mr-3 glow-coin" />
            <div>
              <p className="text-4xl md:text-5xl font-extrabold text-yellow-300">
                ₦10,000
              </p>
              <p className="text-sm text-green-100 mt-1">
                One-time verification fee, <strong>automatically refunded</strong> to your dashboard balance after successful verification.
              </p>
            </div>
          </div>

          <div className="space-y-3 w-full text-left animate-slide-up">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-green-300" />
              <span className="text-sm">Identity protection</span>
            </div>
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-green-300" />
              <span className="text-sm">Prevents fraud & bots</span>
            </div>
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-green-300" />
              <span className="text-sm">Unlocks withdrawals & premium features</span>
            </div>
          </div>

          <div className="w-full animate-slide-up">
            <Button
              className="w-full py-4 text-lg font-semibold btn-tivexx hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              onClick={handleProceed}
            >
              <span>Proceed to Verification</span>
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="mt-3 text-xs text-green-200 text-center animate-slide-up">
              The ₦10,000 verification payment will be added back to your dashboard balance after verification.
            </p>
          </div>
        </div>
      </Card>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { text-shadow:0 0 5px #34d399,0 0 10px #10b981,0 0 20px #10b981; } 50% { text-shadow:0 0 10px #34d399,0 0 20px #10b981,0 0 40px #059669; } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInLeft { 0% { transform: translateX(-50px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }

        .animate-fade-in { animation: fadeIn 0.8s ease-in-out; }
        .animate-slide-up { animation: slideUp 1s ease-in-out; }
        .animate-glow { animation: glow 2s infinite alternate; }
        .animate-bounce-slow { animation: bounce 2s infinite alternate; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .glow-coin { filter: drop-shadow(0 0 10px #facc15); }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
      `}</style>
    </div>
  )
}
