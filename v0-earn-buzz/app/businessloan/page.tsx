"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Define Bank interface for type safety
interface Bank {
  name: string;
  code: string;
}

export default function BusinessLoanPage() {
  const router = useRouter()
  const [loanAmount, setLoanAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [accountName, setAccountName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [banksList, setBanksList] = useState<Bank[]>([])
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const BANKS = [
    "Moniepoint",
    "Access Bank Plc",
    "Guaranty Trust Bank Plc (GTBank)",
    "Zenith Bank Plc",
    "First Bank of Nigeria Ltd (FirstBank)",
    "United Bank for Africa (UBA)",
    "Union Bank of Nigeria Plc",
    "Fidelity Bank Plc",
    "Ecobank Nigeria Plc",
    "Stanbic IBTC Bank Plc",
    "Wema Bank Plc",
    "First City Monument Bank (FCMB)",
    "Sterling Bank Plc",
    "Polaris Bank Plc",
    "Keystone Bank Ltd",
    "Providus Bank Ltd",
    "Heritage Bank Plc",
    "Standard Chartered Bank Nigeria Ltd",
    "Titan Trust Bank Ltd",
    "Globus Bank Ltd",
    "Rubies Bank",
    "Kuda Bank",
    "Opay Bank",
    "VFD Microfinance Bank",
    "SunTrust Bank Nigeria Ltd",
    "Nova Merchant Bank",
    "PalmPay Bank",
    "Sparkle (Access Product)",
    "Parallex Bank",
    "FSDH Merchant Bank",
    "Renmoney Bank",
    "FairMoney Bank",
    "MintMFB",
    "Paycom MFB",
    "Mkobo MFB",
    "Diamond Bank",
    "Citibank Nigeria Limited",
    "Eclectics International",
    "Credit Direct MFB",
    "Enterprise Bank",
    "STB (Small Trust Bank)",
    "Suburban MFB",
    "Heritage Digital",
    "MicroCred / Baobab",
    "Other Popular Bank A",
    "Other Popular Bank B",
    "Other Popular Bank C",
    "Other Popular Bank D",
    "Other Popular Bank E"
  ]

  // Filter banks based on search query
  const filteredBanks = BANKS.filter(bank =>
    bank.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const MIN_LOAN = 500000
  const MAX_LOAN = 5000000
  const PROCESSING_RATE = 0.03

  // Handle dropdown outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  // Live computed values
  const loanAmountNum = Math.floor(numericValue(loanAmount))
  const processingFee = loanAmountNum > 0 ? Math.ceil(loanAmountNum * PROCESSING_RATE) : 0
  const totalPayableNow = loanAmountNum > 0 ? loanAmountNum + processingFee : 0

  // Auto-verify account when 10-digit account number and bank code is found
  async function verifyAccount() {
    setVerifyError(null)
    setVerified(false)
    const cleaned = accountNumber.replace(/\D/g, "")

    if (cleaned.length !== 10 || !selectedBank) {
      setVerifyError("Enter a valid 10-digit account and select a bank")
      return
    }

    // Find bank code from fetched bank list (same logic as withdrawal page)
    const found = banksList.find((b: Bank) => {
      const bn = (b.name || "").toLowerCase()
      const sel = (selectedBank || "").toLowerCase()
      return bn === sel || bn.includes(sel) || sel.includes(bn)
    })

    if (!found || !found.code) {
      setVerifyError("Bank not supported for automatic verification — please enter the account name manually")
      return
    }

    setVerifying(true)
    try {
      // Diagnostic: log request payload (no secrets)
      // eslint-disable-next-line no-console
      console.log("verifyAccount request", { account_number: cleaned, bank_code: found.code })
      const res = await fetch(`/api/verify-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: cleaned, bank_code: found.code }),
      })
      const data = await res.json()
      // Diagnostic: log response payload from server (contains Paystack response)
      // eslint-disable-next-line no-console
      console.log("verifyAccount response", { status: res.status, body: data })

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

              {/* Bank Dropdown with Search */}
              <div ref={dropdownRef} className="relative">
                <Label className="block text-sm font-medium text-emerald-200 mb-2">Bank</Label>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="w-full rounded-md border border-white/8 bg-white/10 text-left px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:shadow-lg transition text-white"
                >
                  <span className={selectedBank ? "text-white" : "text-white/60"}>{selectedBank || "Select a bank"}</span>
                  <svg
                    className={`w-5 h-5 text-emerald-300 transform transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" fill="currentColor" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute z-40 mt-2 w-full rounded-md border border-white/8 bg-gradient-to-b from-green-800 via-green-900 to-green-950 shadow-lg animate-bounceIn max-h-72 overflow-hidden">
                    {/* Search Box */}
                    <div className="p-3 border-b border-white/8">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                        <Input
                          type="text"
                          placeholder="Search banks..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 bg-white/10 border-white/8 text-white placeholder:text-white/60"
                        />
                      </div>
                    </div>
                    
                    {/* Banks List */}
                    <ul className="max-h-60 overflow-y-auto">
                      {filteredBanks.length > 0 ? (
                        filteredBanks.map((bank, idx) => (
                          <li
                            key={`${bank}-${idx}`}
                            onClick={() => {
                              setSelectedBank(bank)
                              setDropdownOpen(false)
                              setSearchQuery("")
                              setAccountNumber("")
                              setAccountName("")
                              setVerified(false)
                              setVerifyError("")
                            }}
                            className={`px-4 py-3 cursor-pointer select-none text-sm text-white hover:bg-white/10 transition ${
                              selectedBank === bank ? "bg-white/20 font-medium" : ""
                            }`}
                          >
                            {bank}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-3 text-sm text-white/60 text-center">
                          No banks found matching "{searchQuery}"
                        </li>
                      )}
                    </ul>
                  </div>
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

              {/* Fee Summary - Using the previously unused variables */}
              {(loanAmountNum >= MIN_LOAN) && (
                <div className="p-4 rounded-lg bg-green-900/20 border border-green-800/30 animate-inner-bounce-child delay-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-white/70">Loan Amount:</p>
                      <p className="text-emerald-300 font-semibold">{formatCurrency(loanAmountNum)}</p>
                    </div>
                    <div>
                      <p className="text-white/70">Processing Fee (3%):</p>
                      <p className="text-amber-300 font-semibold">{formatCurrency(processingFee)}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-white/10">
                      <p className="text-white/70">Total to Pay Now:</p>
                      <p className="text-green-300 font-bold text-lg">{formatCurrency(totalPayableNow)}</p>
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="mt-2 p-3 rounded-lg bg-red-900/30 text-red-300 border border-red-800 animate-inner-bounce-child delay-5">{error}</div>}

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!loanAmount || !accountNumber || !selectedBank || !accountName || submitting}
                className={`w-full inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold transition-all ${
                  !loanAmount || !accountNumber || !selectedBank || !accountName
                    ? "bg-white/10 text-white/60 cursor-not-allowed border border-white/8"
                    : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:scale-[1.02] border border-green-500/20"
                } animate-inner-bounce-child delay-6`}
              >
                {submitting ? "Redirecting to Payment..." : "Continue to Processing Fee"}
              </button>
            </div>

            <p className="mt-4 text-xs text-white/70 animate-inner-bounce-child delay-7">
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
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          60% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
        .animate-slideUp {
          animation: slideUp 1s ease-in-out;
        }
        .animate-slideDown {
          animation: slideDown 1s ease-in-out;
        }
        .animate-bounceIn {
          animation: bounceIn 0.4s ease-in-out;
        }

        /* Page-wide gentle bounce */
        @keyframes gentleBouncePage { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-page-bounce { animation: gentleBouncePage 1.6s ease-in-out infinite; }

        /* Subtler inner bounce for the box and its children */
        @keyframes gentleBounceInner { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-inner-bounce { animation: gentleBounceInner 1.6s ease-in-out infinite; }
        .animate-inner-bounce-child { animation: gentleBounceInner 1.6s ease-in-out infinite; }

        /* Staggered delays for a slightly organic motion */
        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }
        .delay-5 { animation-delay: 0.60s; }
        .delay-6 { animation-delay: 0.72s; }
        .delay-7 { animation-delay: 0.84s; }
      `}</style>
    </div>
  )
}