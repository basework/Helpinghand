"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Sparkles } from "lucide-react"

export default function SetupWithdrawalAccountPage() {
  const router = useRouter()
  const [bank, setBank] = useState<string>("")
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [accountNumber, setAccountNumber] = useState<string>("")
  const [accountName, setAccountName] = useState<string>("")
  const [banksList, setBanksList] = useState<Array<{ name: string; code: string }>>([])
  const [bankCode, setBankCode] = useState<string>("")
  const [verifying, setVerifying] = useState<boolean>(false)
  const [verified, setVerified] = useState<boolean>(false)
  const [verifyError, setVerifyError] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [bankSearchInput, setBankSearchInput] = useState("")

  const filteredBanks = banksList.filter((bankItem) =>
    bankItem.name.toLowerCase().includes(bankSearchInput.toLowerCase())
  )

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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (dropdownOpen && searchInputRef.current) {
      // Small delay to ensure dropdown is fully open
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [dropdownOpen])

  // Page initial loading popup
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Fetch banks from server (Paystack via server route)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/banks`)
        if (!res.ok) return
        const data = await res.json()
        if (mounted && data && data.banks) {
          const filteredList = data.banks.filter(
            (bankItem: any) => !bankItem.name.toLowerCase().includes("goodnews microfinance")
          )
          setBanksList(filteredList)
        }
      } catch (err) {
        // ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Verify account function
  async function verifyAccount() {
    setVerifyError("")
    setVerifying(true)
    try {
      // Diagnostic: log request payload (no secrets)
      // eslint-disable-next-line no-console
      console.log("withdraw.verifyAccount request", { account_number: accountNumber.replace(/\D/g, ""), bank_code: bankCode })
      const res = await fetch(`/api/verify-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber.replace(/\D/g, ""), bank_code: bankCode }),
      })
      const data = await res.json()
      // Diagnostic: log response payload from server (contains Paystack response)
      // eslint-disable-next-line no-console
      console.log("withdraw.verifyAccount response", { status: res.status, body: data })

      if (!res.ok || data.error) {
        setVerifyError(data.error || "Failed to verify account")
        setVerified(false)
      } else {
        const resolvedName = data.account_name || data.data?.account_name || ""
        setAccountName(resolvedName)
        setVerified(true)
      }
    } catch (err) {
      setVerifyError("Failed to verify account")
      setVerified(false)
    } finally {
      setVerifying(false)
    }
  }

  // Auto-trigger verification when a full 10-digit account number is entered and a bank is selected
  useEffect(() => {
    const cleaned = accountNumber.replace(/\D/g, "")
    if (cleaned.length === 10 && bankCode) {
      const t = setTimeout(() => {
        verifyAccount()
      }, 350)
      return () => clearTimeout(t)
    }
  }, [accountNumber, bankCode])

  const handleProceed = () => {
    if (!bank || !accountNumber || !accountName) return
    setTransitioning(true)
    setTimeout(() => {
    window.location.href = "/verifyme"
    }, 5000)
  }

  // Handle bank selection
  const handleBankSelect = (bankName: string, code: string) => {
    setBank(bankName)
    setBankCode(code)
    setDropdownOpen(false)
    setBankSearchInput("") // Clear search when a bank is selected
    setAccountNumber("")
    setAccountName("")
    setVerified(false)
    setVerifyError("")
  }

  // Loading popup
  if (loading || transitioning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black text-white relative overflow-hidden">
        <div className="animate-glow text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-3xl font-extrabold tracking-widest mb-2">Helping Hands</h1>
          <p className="text-lg font-medium opacity-90">
            {transitioning ? "Redirecting securely..." : "Loading secure setup..."}
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-green-800/30 to-black/30 animate-gradientMove"></div>

        <style jsx global>{`
          @keyframes glow {
            0% {
              text-shadow: 0 0 5px #fff, 0 0 10px #b7f7c0, 0 0 20px #38a169, 0 0 40px #38a169;
            }
            50% {
              text-shadow: 0 0 10px #fff, 0 0 20px #b7f7c0, 0 0 40px #48bb78, 0 0 80px #48bb78;
            }
            100% {
              text-shadow: 0 0 5px #fff, 0 0 10px #b7f7c0, 0 0 20px #38a169, 0 0 40px #38a169;
            }
          }

          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animate-glow h1 {
            animation: glow 2.5s infinite alternate;
          }

          .animate-gradientMove {
            background-size: 200% 200%;
            animation: gradientMove 5s ease infinite;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-900 to-black px-4 py-10 animate-fadeIn animate-page-bounce relative">
      {/* Back Button - Updated like previous page */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-200 text-sm font-medium group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <div className="w-full max-w-xl bg-white/6 backdrop-blur-lg border border-white/8 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01] text-white animate-inner-bounce">
        <div className="px-6 py-6 border-b border-white/8 bg-white/10">
          <h1 className="text-2xl font-bold text-emerald-200 animate-slideDown animate-inner-bounce-child delay-0">Withdrawal Setup</h1>
          <p className="text-sm text-white/80 mt-1 animate-inner-bounce-child delay-1">
            Fill in your withdrawal details to receive payouts securely. Your information is protected.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 gap-5 animate-slideUp animate-inner-bounce-child delay-2">
          {/* Bank Dropdown - Updated with search like previous page */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-emerald-200 mb-2">Bank</label>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-full rounded-md border border-white/8 bg-white/10 text-left px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:shadow-lg transition text-white"
            >
              <span className={bank ? "text-white" : "text-white/60"}>{bank || "Select a bank"}</span>
              <svg
                className={`w-5 h-5 text-emerald-300 transform transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" fill="currentColor" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute z-50 mt-2 w-full bg-gradient-to-b from-green-800 via-green-900 to-green-950 border border-white/8 shadow-lg rounded-md overflow-hidden animate-bounceIn">
                {/* Search bar at top - Same as previous page */}
                <div className="sticky top-0 z-50 bg-gradient-to-r from-green-800 to-emerald-900 p-3 border-b border-emerald-700/50">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <Search className="h-4 w-4 text-emerald-300" />
                      <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="🔍 Search banks... Type to find your bank!"
                      value={bankSearchInput}
                      onChange={(e) => setBankSearchInput(e.target.value)}
                      className="w-full rounded-lg px-12 py-3 bg-white/10 text-white placeholder:text-emerald-200/70 border border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm transition-all duration-200 backdrop-blur-sm"
                      style={{
                        maxWidth: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                    {bankSearchInput && (
                      <button
                        onClick={() => setBankSearchInput("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-300 hover:text-white text-sm bg-emerald-800/50 rounded-full w-6 h-6 flex items-center justify-center hover:bg-emerald-700/50 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-emerald-300/80">
                      {filteredBanks.length} bank{filteredBanks.length !== 1 ? 's' : ''} found
                    </span>
                    <span className="text-xs text-amber-300/80 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Quick search!
                    </span>
                  </div>
                </div>
                
                {/* Bank list - Mobile friendly with cute styling */}
                <div 
                  className="overflow-y-auto"
                  style={{
                    maxHeight: "calc(min(400px, calc(100vh - 150px)) - 120px)",
                  }}
                >
                  {banksList.length > 0 ? (
                    filteredBanks.length > 0 ? (
                      filteredBanks.map((bankItem) => (
                        <div 
                          key={bankItem.code} 
                          onClick={() => handleBankSelect(bankItem.name, bankItem.code)}
                          className={`hover:bg-gradient-to-r hover:from-emerald-800/50 hover:to-green-800/50 cursor-pointer py-3 px-4 text-base sm:text-sm border-b border-emerald-900/30 last:border-b-0 transition-all duration-200 hover:pl-6 group ${
                            bank === bankItem.name ? "bg-emerald-900/30" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-amber-400 transition-colors"></div>
                            <span className="truncate">{bankItem.name}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-900/50 mb-3">
                          <Search className="h-6 w-6 text-emerald-300" />
                        </div>
                        <p className="text-emerald-200 font-medium">No banks found</p>
                        <p className="text-sm text-emerald-300/70 mt-1">Try searching with different keywords</p>
                      </div>
                    )
                  ) : (
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-900/50 animate-pulse mb-2">
                        <Sparkles className="h-5 w-5 text-emerald-300" />
                      </div>
                      <p className="text-emerald-200">Loading banks...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {bank && (
              <p className="text-xs text-emerald-300 mt-2">
                Selected: <span className="font-medium">{bank}</span>
              </p>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-2">Account Number</label>
            <div className="flex gap-2">
              <input
                value={accountNumber}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "")
                  if (v.length <= 10) {
                    setAccountNumber(v)
                    setVerified(false)
                    setVerifyError("")
                  }
                }}
                placeholder="Enter account number"
                inputMode="numeric"
                maxLength={10}
                className="flex-1 rounded-md border border-white/8 bg-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-white placeholder:text-white/60"
              />

              <button
                onClick={async () => {
                  // manual verify
                  if (accountNumber.replace(/\D/g, "").length !== 10 || !bankCode) return
                  await verifyAccount()
                }}
                disabled={accountNumber.replace(/\D/g, "").length !== 10 || !bankCode || verifying}
                className={`rounded-md px-4 py-3 text-sm font-semibold transition-all ${
                  accountNumber.replace(/\D/g, "").length !== 10 || !bankCode
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
            {verifyError && <p className="text-sm text-amber-300 mt-2">{verifyError}</p>}
          </div>

          {/* Account Name */}
          <div className="animate-inner-bounce-child delay-3">
            <label className="block text-sm font-medium text-emerald-200 mb-2">
              Account Name
              {verified && <span className="ml-2 inline-block bg-emerald-900/30 text-emerald-300 text-xs px-2 py-1 rounded border border-emerald-800/30">Verified ✓</span>}
            </label>
            <input
              value={accountName}
              onChange={(e) => {
                if (!verified) setAccountName(e.target.value)
              }}
              placeholder="Enter account name"
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

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!bank || !accountNumber || !accountName}
            className={`w-full inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold transition-all ${
              !bank || !accountNumber || !accountName
                ? "bg-white/10 text-white/60 cursor-not-allowed border border-white/8"
                : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:scale-[1.02] border border-green-500/20"
            } animate-inner-bounce-child delay-4`}
          >
            Proceed
          </button>
        </div>
      </div>

      {/* Animation styles */}
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
      `}</style>
    </div>
  )
}