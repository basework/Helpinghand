"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"

function PayKeyPaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const fullName = searchParams.get("fullName") || ""
  const amount = searchParams.get("amount") || "10,000"
  // Reference ID: dynamic from ?ref= or fallback
  const referenceId = searchParams.get("ref") || "500222"
  
  const bankName = "Moniepoint"
  const accountNumber = "5523455338"
  const accountName = "Godswill David"

  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleConfirmPayment = () => {
    const params = new URLSearchParams({ fullName, amount })
    router.push(`/paykeys/confirmation?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-700 via-green-900 to-black overflow-y-auto py-10 px-4 text-white">
      <h1 className="text-5xl font-extrabold mb-6 text-center">Helping Hands</h1>

      <Card className="max-w-md w-full p-6 space-y-6 bg-white/6 backdrop-blur-lg border border-white/8 shadow-2xl rounded-2xl">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2 text-emerald-200">Complete this bank transfer to proceed</h2>
          <p className="text-2xl font-extrabold text-amber-300">₦ {amount}</p>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-white/10 rounded-lg border border-white/8">
            <p className="text-sm text-white/80">Bank Name</p>
            <p className="font-bold text-white">{bankName}</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/8">
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
        <div className="mt-4 p-4 bg-emerald-900/30 border border-emerald-800/30 rounded-lg">
          <h3 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
            <span>📸</span> Send Payment Proof
          </h3>
          <p className="text-sm text-emerald-200 mb-4">
            After making the transfer, please send a screenshot of your payment receipt to our Telegram support team for verification.
          </p>
          <a
            href="https://t.me/tivexx9ja"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all border border-green-500/20"
          >
            <span>📱</span> Open Telegram Support
          </a>
        </div>

        {/* Reference ID - placed below upload, as shown in the photo */}
        <div className="text-center mt-3">
          <p className="text-xs text-white/60 tracking-widest">REFERENCE ID - {referenceId}</p>
        </div>

        <Button
          className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold mt-2 border border-green-500/20"
          onClick={handleConfirmPayment}
        >
          I have made this bank Transfer
        </Button>
      </Card>
    </div>
  )
}

export default function PayKeyPaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black text-white">
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