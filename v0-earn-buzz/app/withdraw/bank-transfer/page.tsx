"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense, useEffect, useRef } from "react"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { OpayWarningPopup } from "@/components/opay-warning-popup"

function PayKeyPaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const fullName = searchParams.get("fullName") || ""
  const amount = searchParams.get("amount") || "5,500"
  // Reference ID: dynamic from ?ref= or fallback
  const referenceId = searchParams.get("ref") || "500404"
  
  const bankName = "Moniepoint"
  const accountNumber = "6558180039"
  const accountName = "Favour Odinakachukwu"

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showOpayWarning, setShowOpayWarning] = useState<boolean>(true)
  // Modified: State to track if reference ID text was copied
  const [copiedRefId, setCopiedRefId] = useState(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    // Modified: Changed popup cycle from 6s show + 4s hide to 10-second interval between appearances
    // Show popup immediately, then hide after 4 seconds
    setShowOpayWarning(true)
    
    function scheduleCycle() {
      const hideTimer = window.setTimeout(() => {
        setShowOpayWarning(false)
        // Modified: Schedule next appearance after 10 seconds (enforcing 10s minimum interval)
        const showTimer = window.setTimeout(() => {
          setShowOpayWarning(true)
          scheduleCycle() // Recursively schedule the next cycle
        }, 10000) // 10-second interval between popup appearances
        timersRef.current.push(showTimer)
      }, 4000) // Keep popup visible for 4 seconds each time
      timersRef.current.push(hideTimer)
    }

    scheduleCycle()

    return () => {
      timersRef.current.forEach((id) => clearTimeout(id))
      timersRef.current = []
    }
  }, [])

  const formatNumber = (val: string | number) => {
    const n = Number(String(val).replace(/[^0-9.-]/g, ""))
    if (isNaN(n)) return String(val)
    return n.toLocaleString("en-NG")
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleConfirmPayment = () => {
    const rawAmount = String(amount).replace(/[^0-9.-]/g, "")
    const params = new URLSearchParams({ fullName, amount: rawAmount })
    router.push(`/paykeys/confirmation?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-700 via-green-900 to-black overflow-y-auto py-10 px-4 pt-20 text-white animate-page-bounce relative">
      {/* Back Button (shared Button component) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-50 text-emerald-200 hover:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <h1 className="text-5xl font-extrabold mb-6 text-center">Helping Hands</h1>

      <Card className="max-w-md w-full p-6 space-y-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-2xl rounded-2xl animate-inner-bounce">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2 text-emerald-200">Complete this bank transfer to proceed</h2>
          <p className="text-2xl font-extrabold text-amber-300 animate-inner-bounce-child delay-1">₦ {formatNumber(amount)}</p>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-white/10 rounded-lg border border-white/8">
            <p className="text-sm text-white/80">Bank Name</p>
            <p className="font-bold text-white">{bankName}</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/8 animate-inner-bounce-child delay-3">
            <div>
              <p className="text-sm text-white/80">Account Number</p>
              <p className="font-bold text-white">{accountNumber}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-green-600 to-green-700 text-white border-green-500/20 hover:from-green-700 hover:to-green-800"
              onClick={() => copyToClipboard(accountNumber, "account")}
            >
              {copiedField === "account" ? "Copied!" : "Copy"}
            </Button>
          </div>

          <div className="p-3 bg-white/10 rounded-lg border border-white/8">
            <p className="text-sm text-white/80">Account Name</p>
            <p className="font-bold text-white">{accountName}</p>
          </div>
        </div>

        {/* Payment Proof Section */}
        <div className="mt-4 p-4 bg-emerald-900/30 border border-emerald-800/30 rounded-lg animate-inner-bounce-child delay-1">
          <h3 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
            <span>📸</span> Send Payment Proof
          </h3>
          <p className="text-sm text-emerald-200 mb-4">
            After making the transfer, please send a screenshot of your payment receipt to our Telegram support team for verification.
          </p>
          <a
            href="https://t.me/helpinghandsupport"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all border border-green-500/20"
          >
            <span>📱</span> Open Telegram Support
          </a>
        </div>

        {/* Modified: Reference ID display with '500404' text and copy button */}
        <div className="text-center mt-3 animate-inner-bounce-child delay-4">
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs text-white/60 tracking-widest">REFERENCE ID - 500404</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText("500404")
                setCopiedRefId(true)
                setTimeout(() => setCopiedRefId(false), 2000)
              }}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Copy reference ID"
            >
              {copiedRefId ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <Copy className="h-3 w-3 text-white/40 hover:text-white/60" />
              )}
            </button>
          </div>
        </div>

        <Button
          className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold mt-2 border border-green-500/20 animate-inner-bounce-child delay-0"
          onClick={handleConfirmPayment}
        >
          I have made this bank Transfer
        </Button>
      </Card>

      {showOpayWarning && <OpayWarningPopup onClose={() => setShowOpayWarning(false)} />}

      <style jsx global>{`
        @keyframes gentleBounceInner {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-inner-bounce { animation: gentleBounceInner 1.6s ease-in-out infinite; }
        .animate-inner-bounce-child { animation: gentleBounceInner 1.6s ease-in-out infinite; }

        /* Staggered delays for a dynamic, slightly organic motion */
        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }
      `}</style>
    </div>
  )
}

export default function PayKeyPaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black text-white animate-page-bounce">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-4xl font-extrabold tracking-wider mb-2">Helping Hands</h1>
          <p className="text-lg font-medium">Loading Payment Details...</p>
        </div>
      </div>
    }>
      <PayKeyPaymentContent />
    </Suspense>
  )
}