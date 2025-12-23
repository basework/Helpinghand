"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WithdrawalReceiptPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [selectedBank, setSelectedBank] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [showFixPopup, setShowFixPopup] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("tivexx-user")
    const bank = localStorage.getItem("selectedBank")
    const amount = localStorage.getItem("withdrawAmount")

    if (!storedUser || !bank) {
      router.push("/withdraw")
      return
    }

    setUserData(JSON.parse(storedUser))
    setSelectedBank(bank)
    setWithdrawAmount(Number(amount) || 0)
  }, [router])

  const handleVerifyNow = () => {
    setShowFixPopup(true)
  }

  const handleUnderstand = () => {
    setShowFixPopup(false)
    router.push("/withdraw/bank-transfer")
  }

  if (!userData) {
    return <div className="p-6 text-center">Loading...</div>
  }

  const currentDate = new Date().toLocaleString("en-NG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {showFixPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-green-600 to-black rounded-xl p-6 max-w-sm mx-auto relative shadow-2xl border-2 border-green-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">Identity Verification Required</h3>

              <p className="text-white/90 mb-4 text-sm leading-relaxed">
                A one-time identity verification fee of <span className="font-bold">₦5,000</span> is required as per
                Central Bank of Nigeria regulations.
              </p>

              <p className="text-white font-semibold mb-6 text-sm bg-white/10 p-3 rounded-lg">
                ✅ Pay once, withdraw FREE forever!
              </p>

              <Button
                onClick={handleUnderstand}
                className="w-full bg-white hover:bg-gray-100 text-green-700 py-3 rounded-lg font-semibold"
              >
                I Understand
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center p-4 bg-white border-b">
        <Link href="/withdraw/select-bank">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-800">Withdrawal Receipt</h1>
      </div>

      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-dashed border-gray-300">
          <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-gray-200">
            <div className="text-4xl mb-2">🧾</div>
            <h2 className="text-2xl font-bold text-gray-800">Withdrawal Receipt</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">User:</span>
              <span className="text-gray-800 font-semibold">{userData.name}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-800 font-semibold text-sm">{userData.email}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Bank:</span>
              <span className="text-gray-800 font-semibold">{selectedBank}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Amount:</span>
              <span className="text-green-600 font-bold text-xl">₦{withdrawAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Date:</span>
              <span className="text-gray-800 font-semibold text-sm">{currentDate}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Status:</span>
              <span className="flex items-center gap-2 text-red-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                Withdrawal Pending
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-1">Verification Required</p>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  Withdrawals are manually verified to prevent fraud and ensure referral authenticity.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t-2 border-dashed border-gray-200">
            <p className="text-xs text-gray-500">Transaction ID: EB{Date.now().toString().slice(-8)}</p>
          </div>
        </div>

        <Button
          onClick={handleVerifyNow}
          className="w-full mt-6 py-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-lg font-semibold"
        >
          Verify Now
        </Button>
      </div>
    </div>
  )
}
