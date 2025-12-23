"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoanPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showApproval, setShowApproval] = useState(false)
  const [loanAmount, setLoanAmount] = useState(0)
  const [showBusinessLoanPopup, setShowBusinessLoanPopup] = useState(false)
  const [showRestrictionPopup, setShowRestrictionPopup] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [kycData, setKycData] = useState({
    fullName: "",
    dob: "",
    address: "",
    maritalStatus: "Single",
  })

  const [incomeRange, setIncomeRange] = useState("")

  useEffect(() => {
    setMounted(true)
    const storedUser = localStorage.getItem("tivexx-user")

    if (!storedUser) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUser)
    setUserData(user)

    const lastLoanDate = localStorage.getItem("tivexx-last-loan-date")
    if (lastLoanDate) {
      const daysSinceLastLoan = Math.floor((Date.now() - Number.parseInt(lastLoanDate)) / (1000 * 60 * 60 * 24))
      if (daysSinceLastLoan < 7) {
        setShowRestrictionPopup(true)
      }
    }
  }, [router])

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-green-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    )
  }

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!incomeRange) return

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setShowApproval(true)

      // ✅ Choose a random rounded loan amount
      const loanOptions = [20000, 25000, 28000, 30000, 35000]
      const randomAmount = loanOptions[Math.floor(Math.random() * loanOptions.length)]
      setLoanAmount(randomAmount)

      const updatedBalance = userData.balance + randomAmount
      const updatedUser = { ...userData, balance: updatedBalance }
      localStorage.setItem("tivexx-user", JSON.stringify(updatedUser))
      setUserData(updatedUser)

      const transactions = JSON.parse(localStorage.getItem("tivexx-transactions") || "[]")
      transactions.unshift({
        id: Date.now(),
        type: "credit",
        description: "Loan Approved",
        amount: randomAmount,
        date: new Date().toISOString(),
      })
      localStorage.setItem("tivexx-transactions", JSON.stringify(transactions))

      localStorage.setItem("tivexx-last-loan-date", Date.now().toString())
    }, 10000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("NGN", "₦")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-green-900 pb-20">
      {/* Restriction Popup */}
      {showRestrictionPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-auto shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Loan Restriction</h3>
            <p className="text-gray-600 text-center mb-6">You can apply for a loan again in 7 days.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/businessloan")}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Apply for Business Loan
              </Button>
              <Button onClick={() => router.push("/dashboard")} variant="outline" className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Loan Approved Popup (shows first) */}
      {showApproval && !showBusinessLoanPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-2xl text-center">
            <div className="mb-6 animate-bounce">
              <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-4">Your loan has been approved</p>
            <p className="text-3xl font-bold text-green-600 mb-6">{formatCurrency(loanAmount)}</p>
            <Button
              onClick={() => {
                setShowApproval(false)
                setShowBusinessLoanPopup(true)
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ✅ Second Popup - Business Loan */}
      {showBusinessLoanPopup && !showApproval && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-auto shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Want a Higher Loan?</h3>
            <p className="text-gray-600 text-center mb-6">Apply for a Business Loan and get up to ₦500,000!</p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/businessloan")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Apply for Business Loan
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full border border-purple-600 text-purple-700"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-2xl text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Processing your loan application...</p>
            <p className="text-gray-600 text-sm mt-2">Please wait</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/20">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-white">Quick Loan</h1>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {step === 1 && (
          <form onSubmit={handleKycSubmit} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Step 1: KYC Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Full Name</label>
                  <Input
                    type="text"
                    value={kycData.fullName}
                    onChange={(e) => setKycData({ ...kycData, fullName: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Date of Birth</label>
                  <Input
                    type="date"
                    value={kycData.dob}
                    onChange={(e) => setKycData({ ...kycData, dob: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Address</label>
                  <Input
                    type="text"
                    value={kycData.address}
                    onChange={(e) => setKycData({ ...kycData, address: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Marital Status</label>
                  <select
                    value={kycData.maritalStatus}
                    onChange={(e) => setKycData({ ...kycData, maritalStatus: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
                Continue to Step 2
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleIncomeSubmit} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Step 2: Annual Income</h2>

              <div className="space-y-3">
                {[
                  { label: "₦100k - ₦500k", value: "100k-500k" },
                  { label: "₦500k - ₦1M", value: "500k-1M" },
                  { label: "₦1M - ₦5M", value: "1M-5M" },
                  { label: "₦5M - ₦10M", value: "5M-10M" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setIncomeRange(option.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      incomeRange === option.value
                        ? "bg-green-600 border-green-400 text-white"
                        : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                disabled={!incomeRange}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-6 text-lg disabled:opacity-50"
              >
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}