"use client"

import React, { useEffect, useState, useRef } from "react"

export default function SetupWithdrawalAccountPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-900 to-black px-4 py-10 animate-fadeIn">
      <div className="w-full max-w-xl bg-white/6 backdrop-blur-lg border border-white/8 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01] text-white">
        <div className="px-6 py-6 border-b border-white/8 bg-white/10">
          <h1 className="text-2xl font-bold text-emerald-200 animate-slideDown">Withdrawal Setup</h1>
          <p className="text-sm text-white/80 mt-1">
            Fill in your withdrawal details to receive payouts securely. Your information is protected.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 gap-5 animate-slideUp">
          {/* Bank Dropdown */}
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
              <ul className="absolute z-40 mt-2 w-full max-h-72 overflow-y-auto rounded-md border border-white/8 bg-gradient-to-b from-green-800 via-green-900 to-green-950 shadow-lg animate-bounceIn">
                {(banksList.length ? banksList.map((b, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setBank(b.name)
                      setBankCode(b.code)
                      setDropdownOpen(false)
                      setAccountNumber("")
                      setAccountName("")
                      setVerified(false)
                      setVerifyError("")
                    }}
                    className={`px-4 py-3 cursor-pointer select-none text-sm text-white hover:bg-white/10 transition ${
                      bank === b.name ? "bg-white/20 font-medium" : ""
                    }`}
                  >
                    {b.name}
                  </li>
                )) : BANKS.map((b, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setBank(b)
                      setDropdownOpen(false)
                      setAccountNumber("")
                      setAccountName("")
                      setVerified(false)
                      setVerifyError("")
                      setBankCode("")
                    }}
                    className={`px-4 py-3 cursor-pointer select-none text-sm text-white hover:bg-white/10 transition ${
                      bank === b ? "bg-white/20 font-medium" : ""
                    }`}
                  >
                    {b}
                  </li>
                )))}
              </ul>
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
                  setAccountNumber(v)
                  setVerified(false)
                  setVerifyError("")
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
                }`}
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
          <div>
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
            }`}
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
      `}</style>
    </div>
  )
}