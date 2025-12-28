"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function BusinessLoanPage() {
  const router = useRouter()
  const [loanAmount, setLoanAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [accountName, setAccountName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [banksList, setBanksList] = useState<Array<{ name: string; code: string }>>([])
  const [bankSearchInput, setBankSearchInput] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredBanks = banksList.filter((bank) =>
    bank.name.toLowerCase().includes(bankSearchInput.toLowerCase())
  )

  const MIN_LOAN = 500000
  const MAX_LOAN = 5000000
  const PROCESSING_RATE = 0.03

  // Fetch banks from server on mount (same as withdrawal page)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/banks`)
        if (!res.ok) return
        const data = await res.json()
        if (mounted && data && data.banks) {
          setBanksList(data.banks)
        }
      } catch (err) {
        // ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (searchInputRef.current) {
      // Small delay to ensure dropdown is fully open
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [selectedBank]) // This triggers when dropdown state changes

  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const numericValue = (val: string) => {
    const n = Number(val.toString().replace(/[^0-9.]/g, ""))
    return isNaN(n) ? 0 : n
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 })
      .format(n)
      .replace("NGN", "₦")

  const handleContinue = () => {
    setError(null)
    const loanAmountNum = Math.floor(numericValue(loanAmount))

    if (!loanAmount || !accountNumber || !selectedBank || !accountName) {
      setError("Please fill in all required fields.")
      return
    }

    if (accountNumber.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit account number.")
      return
    }

    if (loanAmountNum < MIN_LOAN || loanAmountNum > MAX_LOAN) {
      setError(`Loan amount must be between ${formatCurrency(MIN_LOAN)} and ${formatCurrency(MAX_LOAN)}.`)
      return
    }

    const fee = Math.ceil(loanAmountNum * PROCESSING_RATE)
    const url = new URL("/withdraw/bank-transfer", window.location.origin)
    url.searchParams.set("amount", fee.toString())
    url.searchParams.set("loanAmount", loanAmountNum.toString())
    url.searchParams.set("accountNumber", accountNumber.replace(/\D/g, ""))
    url.searchParams.set("selectedBank", selectedBank)
    url.searchParams.set("accountName", accountName)
    setSubmitting(true)
    setTimeout(() => {
      router.push(url.toString())
    }, 450)
  }

  // Auto-verify account when 10-digit account number and bank code is found
  async function verifyAccount() {
    setVerifyError(null)
    setVerified(false)
    const cleaned = accountNumber.replace(/\D/g, "")

    if (cleaned.length !== 10 || !selectedBank) {
      setVerifyError("Enter a valid 10-digit account and select a bank")
      return
    }

    const found = banksList.find((b: any) => b.name === selectedBank)

    if (!found || !found.code) {
      setVerifyError("Bank not supported for automatic verification — please enter the account name manually")
      return
    }

    setVerifying(true)
    try {
      const res = await fetch(`/api/verify-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: cleaned, bank_code: found.code }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setVerifyError(data.error || data.message || "Failed to verify account")
        setVerified(false)
      } else {
        const resolvedName = data.account_name || data.data?.account_name || ""
        setAccountName(resolvedName)
        setVerified(true)
        setVerifyError(null)
      }
    } catch (err) {
      setVerifyError("Failed to verify account")
      setVerified(false)
    } finally {
      setVerifying(false)
    }
  }

  useEffect(() => {
    const cleaned = accountNumber.replace(/\D/g, "")
    if (cleaned.length !== 10 || !selectedBank || banksList.length === 0) return

    let mounted = true
    const t = setTimeout(() => {
      if (!mounted) return
      verifyAccount()
    }, 450)

    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [accountNumber, selectedBank, banksList])

  // Handle bank selection
  const handleBankSelect = (value: string) => {
    setSelectedBank(value)
    setBankSearchInput("") // Clear search when a bank is selected
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-green-700 via-green-900 to-black animate-page-bounce">
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-green-600/20 via-green-800/10 to-black/20" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white/90 hover:bg-white/10 p-2 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight drop-shadow-[0_6px_20px_rgba(16,185,129,0.25)] animate-inner-bounce-child delay-0">
              Helping Hands Business Loan
            </h1>
            <p className="text-sm text-white/80 mt-1 animate-inner-bounce-child delay-1">Fast disbursement • One-time processing fee • Repayment: 12 months</p>
          </div>
        </div>

        <main className="space-y-6">
          <Card className="p-6 rounded-3xl bg-white/6 backdrop-blur-lg border border-white/8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-green-600 to-amber-300 text-black shadow-md">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-200 animate-inner-bounce-child delay-0">Loan Overview</h3>
                <p className="text-sm text-white/80 mt-2 animate-inner-bounce-child delay-1">
                  Borrow between <span className="font-semibold text-emerald-300">{formatCurrency(MIN_LOAN)}</span> and{" "}
                  <span className="font-semibold text-emerald-300">{formatCurrency(MAX_LOAN)}</span>. A one-time processing
                  fee of <span className="font-semibold text-amber-300">3%</span> is required and will be charged now.
                </p>
                <p className="mt-3 text-sm text-white/70">Repayment: <span className="font-semibold">12 months</span>. No collateral or BVN required.</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl bg-white/6 backdrop-blur-lg border border-white/8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-emerald-200 animate-inner-bounce-child delay-0">Apply for Business Loan</h2>

            <div className="grid grid-cols-1 gap-5 animate-slideUp animate-inner-bounce-child delay-1">
              {/* Loan Amount */}
              <div>
                <Label htmlFor="loanAmount" className="block text-sm font-medium text-emerald-200 mb-2">Loan Amount (₦)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  min={MIN_LOAN}
                  max={MAX_LOAN}
                  placeholder="Enter amount between 500,000 and 5,000,000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full rounded-md border border-white/8 bg-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-white placeholder:text-white/60"
                />
              </div>

              {/* Account Number */}
              <div>
                <Label className="block text-sm font-medium text-emerald-200 mb-2">Account Number</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="10-digit account number"
                    value={accountNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "")
                      if (v.length <= 10) setAccountNumber(v)
                    }}
                    className="flex-1 rounded-md border border-white/8 bg-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-white placeholder:text-white/60"
                    maxLength={10}
                  />
                  <button
                    onClick={() => {
                      if (accountNumber.replace(/\D/g, "").length === 10 && selectedBank) {
                        verifyAccount()
                      }
                    }}
                    disabled={accountNumber.replace(/\D/g, "").length !== 10 || !selectedBank || verifying}
                    className={`rounded-md px-4 py-3 text-sm font-semibold transition-all ${
                      accountNumber.replace(/\D/g, "").length !== 10 || !selectedBank
                        ? "bg-white/10 text-white/60 cursor-not-allowed border border-white/8"
                        : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-lg border border-green-500/20"
                    } animate-inner-bounce-child delay-2`}
                  >
                    {verifying ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Verifying
                      </span>
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
              </div>

              {/* Bank Dropdown - Mobile Fixed Version */}
              <div>
                <Label className="block text-sm font-medium text-emerald-200 mb-2">Bank</Label>
                <Select value={selectedBank} onValueChange={handleBankSelect}>
                  <SelectTrigger className="w-full rounded-md border border-white/8 bg-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-white text-left">
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent 
                    className="text-white bg-gradient-to-b from-green-800 via-green-900 to-green-950 border border-white/8 shadow-lg max-h-[60vh] max-w-[95vw] w-auto px-2 sm:w-[var(--radix-select-trigger-width)] sm:max-h-64"
                    position="popper"
                    side="bottom"
                    sideOffset={4}
                    avoidCollisions={false}
                  >
                    {/* Search input at top of dropdown */}
                    <div className="sticky top-0 z-50 bg-green-900 p-2 border-b border-white/10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-300" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search banks..."
                          value={bankSearchInput}
                          onChange={(e) => setBankSearchInput(e.target.value)}
                          onClick={(e) => e.stopPropagation()} // Prevent closing on mobile
                          onKeyDown={(e) => e.stopPropagation()} // Prevent dropdown closing on keyboard events
                          className="w-full rounded px-10 py-2 bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                        />
                        {bankSearchInput && (
                          <button
                            onClick={() => setBankSearchInput("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-300 hover:text-white text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Bank list - Mobile friendly */}
                    <div className="overflow-y-auto max-h-[calc(60vh-60px)] sm:max-h-48">
                      {banksList.length > 0 ? (
                        filteredBanks.length > 0 ? (
                          filteredBanks.map((b) => (
                            <SelectItem 
                              key={b.code} 
                              value={b.name} 
                              className="hover:bg-white/10 cursor-pointer py-3 px-4 text-base sm:text-sm"
                              onPointerDown={(e) => e.stopPropagation()} // Fix for mobile touch
                            >
                              {b.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-white/60 text-sm">
                            No banks match your search
                          </div>
                        )
                      ) : (
                        <div className="p-4 text-center text-white/60 text-sm">Loading banks...</div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
                {selectedBank && (
                  <p className="text-xs text-emerald-300 mt-2">
                    Selected: <span className="font-medium">{selectedBank}</span>
                  </p>
                )}
              </div>

              {/* Account Name */}
              <div className="animate-inner-bounce-child delay-3">
                <Label className="block text-sm font-medium text-emerald-200 mb-2">
                  Account Name
                  {verified && <span className="ml-2 inline-block bg-emerald-900/30 text-emerald-300 text-xs px-2 py-1 rounded border border-emerald-800/30">Verified ✓</span>}
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter account name"
                    value={accountName}
                    onChange={(e) => {
                      if (!verified) setAccountName(e.target.value)
                    }}
                    disabled={verified}
                    className={`w-full rounded-md border px-4 py-3 focus:outline-none focus:ring-2 transition text-white ${
                      verified
                        ? "border-emerald-800/30 bg-emerald-900/20 text-emerald-300 cursor-not-allowed focus:ring-emerald-400"
                        : "border-white/8 bg-white/10 focus:ring-emerald-400 placeholder:text-white/60"
                    }`}
                  />
                  {verified && (
                    <p className="text-xs text-emerald-300 mt-1">Resolved from bank lookup</p>
                  )}
                </div>
                {verifyError && <p className="text-sm text-amber-300 mt-2">{verifyError}</p>}
              </div>

              {error && <div className="mt-2 p-3 rounded-lg bg-red-900/30 text-red-300 border border-red-800 animate-inner-bounce-child delay-4">{error}</div>}

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!loanAmount || !accountNumber || !selectedBank || !accountName || submitting}
                className={`w-full inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold transition-all ${
                  !loanAmount || !accountNumber || !selectedBank || !accountName
                    ? "bg-white/10 text-white/60 cursor-not-allowed border border-white/8"
                    : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:scale-[1.02] border border-green-500/20"
                } animate-inner-bounce-child delay-5`}
              >
                {submitting ? "Redirecting to Payment..." : "Continue to Processing Fee"}
              </button>
            </div>

            <p className="mt-4 text-xs text-white/70 animate-inner-bounce-child delay-6">
              Note: The 3% processing fee will be charged now. You will be redirected to complete the payment.
            </p>
          </Card>
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 1s ease-in-out;
        }

        /* Page-wide gentle bounce */
        @keyframes gentleBouncePage { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-page-bounce { animation: gentleBouncePage 1.6s ease-in-out infinite; }

        /* Subtler inner bounce for the box and its children */
        @keyframes gentleBounceInner { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-inner-bounce-child { animation: gentleBounceInner 1.6s ease-in-out infinite; }

        /* Staggered delays for a slightly organic motion */
        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }
        .delay-5 { animation-delay: 0.60s; }
        .delay-6 { animation-delay: 0.72s; }
      `}</style>
    </div>
  )
}