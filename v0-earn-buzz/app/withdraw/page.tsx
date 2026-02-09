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
  const [completedTasksCount, setCompletedTasksCount] = useState(0)
  const TOTAL_DAILY_TASKS = 10

  useEffect(() => {
    const storedUser = localStorage.getItem("tivexx-user")

    if (!storedUser) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUser)
    setUserData(user)
    setBalance(user.balance || 0)

    // Check if a new day has started and reset tasks if needed
    const lastResetDate = localStorage.getItem("tivexx-last-reset-date")
    const today = new Date().toDateString()
    
    if (lastResetDate !== today) {
      // Reset completed tasks for the new day
      localStorage.setItem("tivexx-completed-tasks", "[]")
      localStorage.setItem("tivexx-last-reset-date", today)
      setCompletedTasksCount(0)
    } else {
      // Get completed tasks for the current day
      const completedTasks = JSON.parse(localStorage.getItem("tivexx-completed-tasks") || "[]")
      setCompletedTasksCount(completedTasks.length)
    }

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

  // Keep completed tasks count in sync across tabs and when the page regains focus
  useEffect(() => {
    const updateCompleted = () => {
      try {
        const completed = JSON.parse(localStorage.getItem("tivexx-completed-tasks") || "[]")
        setCompletedTasksCount(Array.isArray(completed) ? completed.length : 0)
      } catch {
        setCompletedTasksCount(0)
      }
    }

    // Update immediately on mount
    updateCompleted()

    const onStorage = (e: StorageEvent) => {
      if (e.key === "tivexx-completed-tasks") updateCompleted()
    }

    const onFocus = () => updateCompleted()

    window.addEventListener("storage", onStorage)
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onFocus)

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onFocus)
    }
  }, [])

  // Recompute whether the cashout button should be shown whenever requirements change.
  // If `toggleActive` (withdraw without referral) is ON, skip the referral check
  // but still require balance and completed tasks. Otherwise require referrals too.
  useEffect(() => {
    const meetsRequirements = toggleActive
      ? (balance >= 500000 && completedTasksCount >= TOTAL_DAILY_TASKS)
      : (balance >= 500000 && referralCount >= 5 && completedTasksCount >= TOTAL_DAILY_TASKS)

    setShowCashout(meetsRequirements)
  }, [balance, referralCount, completedTasksCount, toggleActive])

  const handleCashout = () => {
    // Determine which checks are required: if toggleActive (withdraw without referral)
    // then referrals are NOT required, otherwise referrals are required.
    const needsReferralCheck = !toggleActive

    if (balance < 500000 || (needsReferralCheck && referralCount < 5) || completedTasksCount < TOTAL_DAILY_TASKS) {
      let message = ""
      const failedChecks: string[] = []

      if (balance < 500000) failedChecks.push("₦500,000 minimum balance")
      if (needsReferralCheck && referralCount < 5) failedChecks.push("5 active referrals")
      if (completedTasksCount < TOTAL_DAILY_TASKS) failedChecks.push(`all ${TOTAL_DAILY_TASKS} daily tasks`)

      message = `⚠️ You need: ${failedChecks.join(", ")}.`

      setWarningMessage(message)
      setShowWarning(true)
      setShowCashout(false)

      setTimeout(() => {
        setShowWarning(false)
      }, 4000)

      return
    }

    // If user chose "Withdraw Without Referral", show upgrade modal when they click withdraw.
    if (toggleActive) {
      setShowUpgradePopup(true)
      return
    }

    router.push("/withdraw/select-bank")
  }

  // ✅ Updated Cancel logic
  const handleUpgradeCancel = () => {
    setShowUpgradePopup(false)
    setToggleActive(false)

    // If user meets both requirements, show cashout button again
    if (balance >= 500000 && referralCount >= 5 && completedTasksCount >= TOTAL_DAILY_TASKS) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black pb-24 animate-page-bounce">
      {/* Header */}
      <div className="flex items-center p-4 bg-white/6 border-b border-white/8 backdrop-blur-sm">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-white">Withdraw Funds</h1>
      </div>

      <div className="p-6 max-w-md mx-auto text-center space-y-6 animate-inner-bounce">
        {/* Toggle Section */}
        <div className="flex justify-end items-center mb-2 animate-bounce-slow">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-emerald-200">Withdraw Without Referral</span>
            <div
              onClick={() => setToggleActive(!toggleActive)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                toggleActive ? "bg-gradient-to-r from-green-600 to-emerald-500" : "bg-white/20"
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
        <div className="bg-white/6 backdrop-blur-lg rounded-3xl border border-white/8 p-6 animate-fade-in animate-inner-bounce-child delay-0">
          <p className="text-white/80 text-sm mb-1">Available Balance</p>
          <h2 className="text-4xl font-extrabold text-amber-300">{formatCurrency(balance)}</h2>
        </div>

        {/* Requirements */}
        <div className="bg-white/6 backdrop-blur-lg rounded-2xl p-6 border border-white/8 animate-inner-bounce-child delay-2">
          <h3 className="text-emerald-200 font-bold text-lg mb-3">Withdrawal Requirements</h3>
          <ul className="text-left space-y-2 text-white/80">
            <li>• Minimum balance: ₦500,000</li>
            <li>• At least 5 active referrals</li>
            <li>• Complete all {TOTAL_DAILY_TASKS} daily tasks</li>
            <li>• Each referral must complete registration</li>
          </ul>
        </div>

        {/* Progress */}
        <div className="space-y-4 animate-inner-bounce-child delay-3">
          <div className="text-left">
            <div className="flex justify-between mb-1">
              <span className="text-white/80 text-sm font-medium">Referral Progress</span>
              <span className="text-white font-semibold">{referralCount}/5</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-600 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          <div className="text-left">
            <div className="flex justify-between mb-1">
              <span className="text-white/80 text-sm font-medium">Daily Tasks Progress</span>
              <span className="text-white font-semibold">{completedTasksCount}/{TOTAL_DAILY_TASKS}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-amber-600 to-yellow-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min((completedTasksCount / TOTAL_DAILY_TASKS) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 relative min-h-[100px]">
          {/* compute requirement flags */}
          {/* missing flags used to show clear messages on the button */}
          {(() => {
            const missingBalance = balance < 500000
            const missingTasks = completedTasksCount < TOTAL_DAILY_TASKS
            const missingReferrals = referralCount < 5
            const meetsRequirements = toggleActive
              ? (!missingBalance && !missingTasks)
              : (!missingBalance && !missingTasks && !missingReferrals)

            let buttonLabel = ""
            if (meetsRequirements) {
              buttonLabel = "WITHDRAW NOW"
            } else if (missingBalance) {
              const diff = Math.max(0, 500000 - (balance || 0))
              buttonLabel = `Need ${formatCurrency(diff)} more`
            } else if (missingTasks) {
              buttonLabel = `${completedTasksCount}/${TOTAL_DAILY_TASKS} tasks completed`
            } else if (!toggleActive && missingReferrals) {
              buttonLabel = `${referralCount}/5 referrals`
            } else {
              buttonLabel = "Requirements not met"
            }

            return (
              <div className="space-y-3">
                <Button
                  onClick={handleCashout}
                  disabled={!meetsRequirements}
                  className={`w-full py-5 text-lg font-semibold rounded-xl transition-all border animate-inner-bounce-child delay-0 ${meetsRequirements ? 'text-white bg-gradient-to-r from-green-600 to-green-700 hover:scale-[1.02] border-green-500/20' : 'bg-white/6 text-white/80 cursor-not-allowed border-white/10'}`}
                >
                  {buttonLabel}
                </Button>

                {/* If referrals are the missing piece and the user hasn't toggled withdraw-without-referral, show refer CTA */}
                {!toggleActive && !meetsRequirements && referralCount < 5 && (
                  <Link href="/refer">
                    <Button className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all border border-green-500/20">
                      <Share2 className="h-4 w-4" />
                      Refer Friends to Unlock Withdrawal
                    </Button>
                  </Link>
                )}

                {/* Show inline warning message when other requirements fail */}
                {showWarning && (
                  <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-xl p-3 flex items-center justify-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium text-sm">{warningMessage}</p>
                  </div>
                )}
              </div>
            )
          })()}
        </div>

        {/* Upgrade Popup */}
        {showUpgradePopup && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center animate-inner-bounce-child delay-1">
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
                  className="w-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:scale-[1.02]"
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

        /* Page-wide gentle bounce */
        @keyframes gentleBouncePage { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-page-bounce { animation: gentleBouncePage 1.6s ease-in-out infinite; }

        /* Subtler inner bounce for the box and contents */
        @keyframes gentleBounceInner { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-inner-bounce { animation: gentleBounceInner 1.8s ease-in-out infinite; }
        .animate-inner-bounce-child { animation: gentleBounceInner 1.8s ease-in-out infinite; }

        /* Staggered delays for organic motion */
        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }
      `}</style>
    </div>
  )
}