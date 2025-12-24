"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, Suspense } from "react"

function LoanFeeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const loanAmount = searchParams.get("loanAmount") || "0"
  const accountNumber = searchParams.get("accountNumber") || ""
  const selectedBank = searchParams.get("selectedBank") || ""
  const accountName = searchParams.get("accountName") || ""

  const processingFee = useMemo(() => {
    const amount = Number.parseFloat(loanAmount)
    return Math.round(amount * 0.06) // 6% processing fee
  }, [loanAmount])

  const handlePayProcessingFee = () => {
    const params = new URLSearchParams({
      loanAmount,
      accountNumber,
      selectedBank,
      accountName,
      processingFee: processingFee.toString(),
    })
    router.push(`/loan/payment?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/10 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-white text-xl font-medium">Processing Fee</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Loan Summary */}

        {/* Processing Fee Card */}
        <Card className="p-6 space-y-4 border-orange-200 bg-orange-50">
          <h2 className="text-lg font-semibold text-orange-800">Processing Fee Required</h2>

          <div className="space-y-3">
            <p className="text-sm text-orange-700">
              To process your loan application, you need to pay a processing fee of 6% of the loan amount.
            </p>

            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Processing Fee (6%):</span>
                <span className="text-2xl font-bold text-orange-600">₦{processingFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-xs text-orange-600 space-y-1">
              <p>• This fee is required to activate your loan</p>
              <p>• Your loan will be disbursed immediately after payment</p>
              <p>• Processing fee is non-refundable</p>
            </div>
          </div>
        </Card>

        {/* Payment Button */}
        <Button
          className="w-full h-12 text-lg font-medium bg-orange-600 hover:bg-orange-700"
          onClick={handlePayProcessingFee}
        >
          Pay Processing Fee - ₦{processingFee.toLocaleString()}
        </Button>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          By proceeding, you agree to pay the processing fee. Your loan will be processed and disbursed to your account
          within 24 hours after successful payment verification.
        </p>
      </div>
    </div>
  )
}

export default function LoanFeePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      }
    >
      <LoanFeeContent />
    </Suspense>
  )
}