"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Share2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WithdrawPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [referralCount, setReferralCount] = useState(0)
  const [balance, setBalance] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [showCashout, setShowCashout] = useState(true)
  const [warningMessage, setWarningMessage] = useState("")
  const [toggleActive, setToggleActive] = useState(false)
  const [showUpgradePopup, setShowUpgradePopup] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("tivexx-user")

    if (!storedUser) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUser)
    setUserData(user)
    setBalance(user.balance || 0)

    fetchReferralCount(user.id || user.userId)
  }, [router])

  const fetchReferralCount = async (userId: string) => {
    try {
      // FIXED: Point to your actual endpoint
      const response = await fetch(`/api/referral-stats?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setReferralCount(data.referral_count || 0)
      }
    } catch (error) {
      console.error("Error fetching referral count:", error)
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    })
      .format(amount)
      .replace("NGN", "₦")

  // FIXED: Memoize progress width to avoid reflows on re-renders
  const progressWidth = useMemo(() => 
    `${Math.min((referralCount / 5) * 100, 100)}%`, 
    [referralCount]
  );

  const handleCashout = () => {
    if (toggleActive) {
      setShowUpgradePopup(true)
      return
    }

    if (balance < 200000 || referralCount < 5) {
      let message = ""
      if (balance < 200000 && referralCount < 5)
        message = "⚠️ You need at least ₦200,000 and 5 referrals to withdraw."
      else if (balance < 200000)
        message = "⚠️ You haven’t reached the ₦200,000 minimum withdrawal balance."
      else
        message = "⚠️ You need at least 5 referrals to unlock withdrawals."

      setWarningMessage(message)
      setShowWarning(true)
      setShowCashout(false)

      setTimeout(() => {
        setShowWarning(false)
      }, 4000)

      return
    }

    router.push("/withdraw/select-bank")
  }

  // ✅ Updated Cancel logic
  const handleUpgradeCancel = () => {
    setShowUpgradePopup(false)
    setToggleActive(false)

    // If user meets both requirements, show cashout button again
    if (balance >= 200000 && referralCount >= 5) {
      setShowCashout(true)
    } else {
      // Otherwise show refer & earn section
      setShowCashout(false)
    }
  }

  const handleUpgradeConfirm = () => {
    setShowUpgradePopup(false)
    setToggleActive(false)
    router.push("/toggle")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      {/* Header */}
      <div className="flex items-center p-4 bg-white/80 border-b shadow-sm backdrop-blur-md">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-green-700">Withdraw Funds</h1>
      </div>

      <div className="p-6 max-w-md mx-auto text-center space-y-6">
        {/* Toggle Section */}
        <div className="flex justify-end items-center mb-2 animate-bounce-slow">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-green-700">Withdraw Without Referral</span>
            <div
              onClick={() => setToggleActive(!toggleActive)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                toggleActive ? "bg-gradient-to-r from-green-600 to-purple-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                  toggleActive ? "translate-x-6" : ""
                }`}
              />
            </div>
          </label>
        </div>

        {/* Balance Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 animate-fade-in">
          <p className="text-gray-600 text-sm mb-1">Available Balance</p>
          <h2 className="text-4xl font-extrabold text-green-700">{formatCurrency(balance)}</h2>
        </div>

        {/* Requirements */}
        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 shadow-inner">
          <h3 className="text-purple-700 font-bold text-lg mb-3">Withdrawal Requirements</h3>
          <ul className="text-left space-y-2 text-purple-900">
            <li>• Minimum balance: ₦200,000</li>
            <li>• At least 5 active referrals</li>
            <li>• Each referral must complete registration</li>
          </ul>
        </div>

        {/* Progress */}
        <div className="text-left">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600 text-sm font-medium">Referral Progress</span>
            <span className="text-gray-800 font-semibold">{referralCount}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-600 to-purple-600 h-full rounded-full transition-all duration-700"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 relative min-h-[100px]">
          {showCashout ? (
            <Button
              onClick={handleCashout}
              className="w-full py-5 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-purple-700 hover:scale-[1.02] transition-all shadow-lg animate-slide-in"
            >
              WITHDRAW NOW
            </Button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {showWarning && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-3 flex items-center justify-center gap-2 animate-bounce-in">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-medium text-sm">{warningMessage}</p>
                </div>
              )}
              <Link href="/refer">
                <Button className="w-full py-5 bg-gradient-to-r from-purple-600 to-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-md">
                  <Share2 className="h-5 w-5" />
                  Refer Friends to Unlock Withdrawal
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Upgrade Popup */}
        {showUpgradePopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center">
              <h2 className="text-lg font-bold text-green-700 mb-2">
                Withdraw Without Referral
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                To use this feature, you need to upgrade your account.
              </p>
              <div className="flex justify-between gap-4">
                <Button
                  onClick={handleUpgradeCancel}
                  className="w-1/2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpgradeConfirm}
                  className="w-1/2 bg-gradient-to-r from-green-600 to-purple-600 text-white rounded-xl hover:scale-[1.02]"
                >
                  Upgrade Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease forwards; }

        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.6s ease forwards; }

        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounceIn 0.4s ease-in-out; }

        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite;
        }
      `}</style>
    </div>
  )
}