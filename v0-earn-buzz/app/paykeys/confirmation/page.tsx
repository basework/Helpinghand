"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { XCircle, ArrowRight } from "lucide-react"

function PayKeyConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResult(true)
    }, 3000) // Tivexx-style 3s loading
    return () => clearTimeout(timer)
  }, [])

  if (!showResult) {
    // Tivexx-style loading popup
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-green-700 text-white relative overflow-hidden">
        <div className="animate-glow text-center z-20">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-4xl font-extrabold tracking-wider mb-2">Helping Hands</h1>
          <p className="text-lg font-medium opacity-90">Confirming your payment...</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-green-800/30 animate-gradientMove"></div>

        <style jsx global>{`
          @keyframes glow { 0% { text-shadow:0 0 5px #34d399,0 0 10px #10b981,0 0 20px #10b981; } 50% { text-shadow:0 0 10px #34d399,0 0 20px #10b981,0 0 40px #059669; } 100% { text-shadow:0 0 5px #34d399,0 0 10px #10b981,0 0 20px #10b981; } }
          @keyframes gradientMove { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
          .animate-glow { animation: glow 2s infinite alternate; }
          .animate-gradientMove { background-size: 200% 200%; animation: gradientMove 6s ease infinite; }
          .animate-spin { animation: spin 1s linear infinite; }
        `}</style>
      </div>
    )
  }

  // Failed payment display with animated gradient + particles
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-gradient-to-br from-green-500 to-green-700 text-white overflow-y-auto py-10 px-4 animate-fade-in">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-800/20 animate-gradientMove -z-10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/40 rounded-full opacity-60 animate-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <h1 className="text-5xl font-extrabold mb-6 text-center animate-glow">Helping Hands</h1>

      <div className="relative z-10 max-w-md w-full p-8 backdrop-blur-lg bg-white/10 border border-green-300 shadow-2xl rounded-2xl animate-slide-up hover:scale-[1.03] hover:shadow-xl overflow-hidden text-center">
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto bg-red-500 rounded-full flex items-center justify-center mb-4 animate-bounce-slow">
          <XCircle className="h-16 w-16 text-white" />
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Transaction verification failed!</h1>
          <p className="text-green-100 leading-relaxed text-sm">
            Your payment could not be confirmed. Reason: No payment received or invalid payment method. <br />
            If you have made the payment, kindly send your payment proof to our support team immediately.
          </p>
        </div>

        {/* Not Available Info */}
        <div className="w-full p-4 border border-gray-300 rounded-lg flex items-center justify-between bg-white/10 mt-4">
          <span className="text-green-100 font-medium">Invalid Payment</span>
          <span className="text-red-400 text-lg">🚫</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <button
            className="w-full h-12 border border-green-300 bg-white/10 hover:bg-green-100/20 text-white rounded-lg font-semibold transition-all"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </button>
          <button
            className="w-full h-12 btn-tivexx text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all animate-buttonGlow"
            onClick={() => window.open("https://t.me/tivexx9jasupport", "_blank")}
          >
            {/* Rotating Telegram logo */}
            <svg
              className="w-5 h-5 animate-spin-slow"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0a12 12 0 100 24A12 12 0 0012 0zm5.303 7.224c.1-.002.32.023.464.14.05.035.084.076.117.12a.502.502 0 01.17.325c.016.093.036.305.02.471-.18 1.897-.962 6.502-1.36 8.627-.168.9-.5 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.183 3.247-2.977 3.307-3.23.007-.031.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014z" />
            </svg>
            Contact Support
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { text-shadow:0 0 5px #34d399,0 0 10px #10b981,0 0 20px #10b981; } 50% { text-shadow:0 0 10px #34d399,0 0 20px #10b981,0 0 40px #059669; } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes particle { 0% { transform: translateY(0) translateX(0); opacity: 0.6; } 50% { transform: translateY(-20px) translateX(15px); opacity: 0.3; } 100% { transform: translateY(0) translateX(0); opacity: 0.6; } }
        @keyframes buttonGlow { 0%,100% { box-shadow: 0 0 5px #10b981,0 0 10px #34d399,0 0 20px #059669; } 50% { box-shadow: 0 0 10px #34d399,0 0 20px #10b981,0 0 40px #059669; } }
        @keyframes spinSlow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .animate-fade-in { animation: fadeIn 0.8s ease-in-out; }
        .animate-slide-up { animation: slideUp 1s ease-in-out; }
        .animate-glow { animation: glow 2s infinite alternate; }
        .animate-bounce-slow { animation: bounce 2s infinite alternate; }
        .animate-gradientMove { background-size: 200% 200%; animation: gradientMove 6s ease infinite; }
        .animate-particle { animation: particle 8s linear infinite; }
        .animate-buttonGlow { animation: buttonGlow 2s infinite alternate; }
        .animate-spin-slow { animation: spinSlow 2s linear infinite; }
      `}</style>
    </div>
  )
}

export default function PayKeyConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-green-700 text-white relative overflow-hidden">
          <div className="animate-glow text-center z-20">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-4xl font-extrabold tracking-wider mb-2">Tivexx9ja</h1>
            <p className="text-lg font-medium opacity-90">Confirming your payment...</p>
          </div>
        </div>
      }
    >
      <PayKeyConfirmationContent />
    </Suspense>
  )
}