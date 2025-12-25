"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, Gamepad2, History, Home, Bell, User, Gift, Clock, Headphones, Shield, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardImageCarousel } from "@/components/dashboard-image-carousel"
import { WithdrawalNotification } from "@/components/withdrawal-notification"
import { ReferralCard } from "@/components/referral-card"
import { TutorialModal } from "@/components/tutorial-modal"
import { ScrollingText } from "@/components/scrolling-text"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface UserData {
  name: string
  email: string
  balance: number
  userId: string
  hasMomoNumber: boolean
  profilePicture?: string
  id?: string
}

interface MenuItem {
  name: string
  icon?: React.ElementType
  emoji?: string
  link?: string
  external?: boolean
  action?: () => void
  color: string
  bgColor: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showBalance, setShowBalance] = useState(true)
  const [showWithdrawalNotification, setShowWithdrawalNotification] = useState(false)
  const [balance, setBalance] = useState(50000)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [canClaim, setCanClaim] = useState(true)
  const [isCounting, setIsCounting] = useState(false)
  const [displayedName, setDisplayedName] = useState("")
  const [nameIndex, setNameIndex] = useState(0)
  const [showTutorial, setShowTutorial] = useState(false)
  const [claimCount, setClaimCount] = useState(0)
  const [pauseEndTime, setPauseEndTime] = useState<number | null>(null)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [showClaimSuccess, setShowClaimSuccess] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])

  const handleCloseWithdrawalNotification = useCallback(() => {
    setShowWithdrawalNotification(false)
  }, [])

  useEffect(() => {
    const savedClaimCount = localStorage.getItem("tivexx-claim-count")
    const savedPauseEndTime = localStorage.getItem("tivexx-pause-end-time")

    if (savedClaimCount) {
      setClaimCount(Number.parseInt(savedClaimCount))
    }

    if (savedPauseEndTime) {
      const pauseTime = Number.parseInt(savedPauseEndTime)
      if (pauseTime > Date.now()) {
        setPauseEndTime(pauseTime)
        setCanClaim(false)
      } else {
        localStorage.removeItem("tivexx-pause-end-time")
        localStorage.setItem("tivexx-claim-count", "0")
        setClaimCount(0)
      }
    }

    const savedTimer = localStorage.getItem("tivexx-timer")
    const savedTimestamp = localStorage.getItem("tivexx-timer-timestamp")

    if (savedTimer && savedTimestamp) {
      const elapsed = Math.floor((Date.now() - Number.parseInt(savedTimestamp)) / 1000)
      const remaining = Number.parseInt(savedTimer) - elapsed

      if (remaining > 0) {
        setTimeRemaining(remaining)
        setIsCounting(true)
        if (!pauseEndTime) {
          setCanClaim(false)
        }
      } else {
        setTimeRemaining(0)
        if (!pauseEndTime) {
          setCanClaim(true)
        }
        setIsCounting(false)
      }
    } else {
      setCanClaim(!pauseEndTime)
      setIsCounting(false)
    }
  }, [])

  useEffect(() => {
    if (!pauseEndTime) return

    const interval = setInterval(() => {
      const remaining = pauseEndTime - Date.now()
      if (remaining <= 0) {
        setPauseEndTime(null)
        setCanClaim(true)
        setClaimCount(0)
        localStorage.removeItem("tivexx-pause-end-time")
        localStorage.setItem("tivexx-claim-count", "0")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [pauseEndTime])

  useEffect(() => {
    if (!isCounting) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1

        localStorage.setItem("tivexx-timer", newTime.toString())
        localStorage.setItem("tivexx-timer-timestamp", Date.now().toString())

        if (newTime === 0) {
          setCanClaim(true)
          setIsCounting(false)
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isCounting])

  const handleClaim = () => {
    if (pauseEndTime && pauseEndTime > Date.now()) {
      setShowPauseDialog(true)
      return
    }

    if (canClaim) {
      const newClaimCount = claimCount + 1
      const newBalance = balance + 1000

      // Update state
      setBalance(newBalance)
      setClaimCount(newClaimCount)
      
      // Save to localStorage
      localStorage.setItem("tivexx-claim-count", newClaimCount.toString())
      
      // CRITICAL FIX: Update user data in localStorage
      if (userData) {
        const updatedUser = { ...userData, balance: newBalance }
        localStorage.setItem("tivexx-user", JSON.stringify(updatedUser))
        setUserData(updatedUser)
      }

      setShowClaimSuccess(true)
      setTimeout(() => setShowClaimSuccess(false), 3000)

      if (newClaimCount >= 50) {
        const fiveHoursLater = Date.now() + 5 * 60 * 60 * 1000
        setPauseEndTime(fiveHoursLater)
        localStorage.setItem("tivexx-pause-end-time", fiveHoursLater.toString())
        setCanClaim(false)
      } else {
        setCanClaim(false)
        setTimeRemaining(60)
        setIsCounting(true)
        localStorage.setItem("tivexx-timer", "60")
        localStorage.setItem("tivexx-timer-timestamp", Date.now().toString())
      }

      if (newClaimCount === 50) {
        setTimeout(() => setShowReminderDialog(true), 1000)
      }

      const transactions = JSON.parse(localStorage.getItem("tivexx-transactions") || "[]")
      transactions.unshift({
        id: Date.now(),
        type: "credit",
        description: "Daily Claim Reward",
        amount: 1000,
        date: new Date().toISOString(),
      })
      localStorage.setItem("tivexx-transactions", JSON.stringify(transactions))
    }
  }

  const formatCurrency = (amount: number) => {
    if (!showBalance) return "••••••••"

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("NGN", "₦")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatPauseTime = () => {
    if (!pauseEndTime) return ""
    const remaining = Math.max(0, pauseEndTime - Date.now())
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  // New: handle profile picture upload (updates state + localStorage)
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    // Read as DataURL and store locally (this avoids adding server logic here)
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const updatedUser = userData ? { ...userData, profilePicture: result } : { name: "User", email: "", balance, userId: `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`, hasMomoNumber: false, profilePicture: result }
      setUserData(updatedUser)
      // persist
      try {
        localStorage.setItem("tivexx-user", JSON.stringify(updatedUser))
      } catch (err) {
        console.error("Failed to persist profile picture to localStorage:", err)
      }
      toast?.({
        title: "Profile updated",
        description: "Your profile picture was updated locally.",
      })
    }
    reader.readAsDataURL(file)
  }

  const menuItems: MenuItem[] = [
    { name: "Loans", emoji: "💳", link: "/loan", color: "text-purple-600", bgColor: "" },
    { name: "Investments", emoji: "📈", link: "/investment", color: "text-violet-600", bgColor: "" },
    { name: "Daily Tasks", emoji: "🎁", link: "/task", color: "text-yellow-600", bgColor: "" },
    {
      name: "Helping Hands Channel",
      emoji: "📢",
      link: "https://t.me/Tivexx9jacommunity",
      external: true,
      color: "text-blue-500",
      bgColor: "",
    },
  ]

  // FIXED: Fetch user data with proper balance sync
  useEffect(() => {
    const storedUser = localStorage.getItem("tivexx-user")

    if (!storedUser) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUser)

    const tutorialShown = localStorage.getItem("tivexx-tutorial-shown")
    if (!tutorialShown) {
      setShowTutorial(true)
    }

    if (typeof user.balance !== "number") {
      user.balance = 50000
    }

    if (!user.userId) {
      user.userId = `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    }

    const fetchUserBalance = async () => {
      try {
        const response = await fetch(`/api/user-balance?userId=${user.id || user.userId}&t=${Date.now()}`)
        const data = await response.json()
        
        // FIX 1: Use the HIGHER balance between localStorage and database (preserves claims)
        const localStorageBalance = user.balance || 50000
        const dbBalance = data.balance || 50000
        const baseBalance = Math.max(localStorageBalance, dbBalance)
        
        // FIX 2: Add referral earnings ONLY ONCE (no double-counting). But if referral already in DB main, skip re-add.
        const referralEarnings = data.referral_balance || 0
        const lastSyncedReferrals = localStorage.getItem("tivexx-last-synced-referrals") || "0"
        
        // Calculate NEW referral earnings since last sync
        const newReferralEarnings = referralEarnings - parseInt(lastSyncedReferrals)
        const totalBalance = baseBalance + Math.max(0, newReferralEarnings)
        
        // Update state with the correct total balance
        setBalance(totalBalance)
        
        // Update localStorage to maintain consistency
        const updatedUser = { 
          ...user, 
          balance: totalBalance
        }
        localStorage.setItem("tivexx-user", JSON.stringify(updatedUser))
        
        // Track what we've already synced to prevent double-counting
        if (newReferralEarnings > 0) {
          localStorage.setItem("tivexx-last-synced-referrals", referralEarnings.toString())
        }
        
        setUserData(updatedUser)

        // BEST FIX: Sync merged total back to DB (includes local claims, avoids loss on next load)
        await fetch(`/api/user-balance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id || user.userId, balance: totalBalance })
        })

      } catch (error) {
        console.error("[Dashboard] Error fetching user balance:", error)
        // Fallback to localStorage data only
        setBalance(user.balance)
        setUserData(user)
      }
    }

    fetchUserBalance()

    setTimeout(() => {
      setShowWithdrawalNotification(true)
    }, 3000)

    const showRandomNotification = () => {
      const randomDelay = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000
      setTimeout(() => {
        setShowWithdrawalNotification(true)
        showRandomNotification()
      }, randomDelay)
    }

    showRandomNotification()
  }, [router])

  useEffect(() => {
    const stored = localStorage.getItem("tivexx-transactions")
    if (stored) {
      try {
        setTransactions(JSON.parse(stored))
      } catch (err) {
        setTransactions([])
      }
    }
  }, [])

  useEffect(() => {
    if (userData && nameIndex < userData.name.length) {
      const timeout = setTimeout(() => {
        setDisplayedName(userData.name.slice(0, nameIndex + 1))
        setNameIndex(nameIndex + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [userData, nameIndex])

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiv-1 mx-auto"></div>
          <p className="mt-4 text-tiv-3">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-4 bg-gradient-to-br from-gray-900 via-green-900 to-black">
      <ScrollingText />

      {showClaimSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-tiv-1 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce">
            <p className="text-xl font-bold text-center">🎉 Congrats!</p>
            <p className="text-lg text-center">₦1,000 has been claimed and added to your balance</p>
          </div>
        </div>
      )}

      <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">⏰ Wait Required</DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <p className="text-base">You must wait 5 hours before claiming again.</p>
              <p className="text-2xl font-bold text-tiv-2">{formatPauseTime()}</p>
              <p className="text-sm">In the meantime, you can earn by referring or taking loans.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => {
                setShowPauseDialog(false)
                router.push("/refer")
              }}
              className="flex-1 bg-tiv-1 hover:bg-tiv-1"
            >
              Refer Friends
            </Button>
            <Button
              onClick={() => {
                setShowPauseDialog(false)
                router.push("/loan")
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Take Loan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">📢 Stay Updated!</DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <p className="text-base">Join our channel for updates and tips for earning.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => {
                setShowReminderDialog(false)
                window.open("https://t.me/Tivexx9jacommunity", "_blank")
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Join Channel
            </Button>
            <Button
              onClick={() => {
                setShowReminderDialog(false)
                router.push("/refer")
              }}
              className="flex-1 bg-tiv-1 hover:bg-tiv-1"
            >
              Refer More Friends
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showTutorial && (
        <TutorialModal
          onClose={() => {
            setShowTutorial(false)
            localStorage.setItem("tivexx-tutorial-shown", "true")
          }}
        />
      )}

      {showWithdrawalNotification && <WithdrawalNotification onClose={handleCloseWithdrawalNotification} />}

      {/* MAIN CONTENT - NOW STACKED VERTICALLY LIKE MOBILE */}
      <div className="max-w-md mx-auto px-4 space-y-4 mt-6">
        {/* Profile Card */}
          <div className="bg-gradient-to-br from-gray-900 via-green-900 to-black rounded-xl p-4 border border-green-800/30 shadow-lg animate-pop-bounce-1">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
              {userData?.profilePicture ? (
                <img src={userData.profilePicture || "/placeholder.svg"} alt={userData.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-semibold text-xl text-tiv-2">{userData?.name.charAt(0)}</span>
              )}
              <input type="file" accept="image/*" onChange={handleProfileUpload} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Upload profile picture" />
            </div>

            <div className="flex-1">
              <div className="font-medium text-lg">Hi, {displayedName} <span className="ml-1">👋</span></div>
              <div className="text-sm text-gray-200">Welcome back!</div>
              <div className="mt-2 text-xs text-tiv-3">User ID: <span className="font-mono">{userData.userId}</span></div>
            </div>
          </div>

          <div className="flex gap-2 mt-3 items-center justify-between">
            <Link href="/loan" className="flex-1">
              <Button className="w-full bg-purple-600 hover:scale-105 transform transition-transform active:scale-95 py-3 text-base rounded-lg">Loan</Button>
            </Link>
            <Link href="/withdraw" className="flex-1">
              <Button className="w-full bg-green-700 hover:scale-105 transform transition-transform active:scale-95 py-3 text-base rounded-lg">Withdraw</Button>
            </Link>
          </div>
        </div>

        {/* Balance Card */}
          <div className="bg-gradient-to-br from-gray-900 via-green-900 to-black rounded-xl p-4 mt-4 shadow-lg border border-green-800/30 animate-pop-bounce-2">
          <div className="text-sm font-medium text-gray-200 mb-1">Your Balance</div>
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">{formatCurrency(balance)}</div>
            <button className="text-gray-200 hover:text-white transition-colors" onClick={() => setShowBalance(!showBalance)} aria-label="Toggle balance visibility">{showBalance ? "👁️" : "🙈"}</button>
          </div>

          <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-tiv-3" /><span className="text-xs font-medium">Next Reward</span></div>
              <span className="text-sm font-bold text-tiv-3">{pauseEndTime ? formatPauseTime() : formatTime(timeRemaining)}</span>
            </div>

            <Button onClick={handleClaim} disabled={!canClaim && !pauseEndTime} className={`w-full ${canClaim || pauseEndTime ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"} text-white font-semibold py-2 rounded-lg transition-transform transform hover:-translate-y-0.5 active:scale-95`}>
              <Gift className="h-4 w-4" />
              <span className="text-sm">{pauseEndTime ? `Wait ${formatPauseTime()}` : canClaim ? "Claim ₦1,000" : `Wait ${formatTime(timeRemaining)}`}</span>
            </Button>
            <p className="text-xs text-center text-gray-300 mt-2">Claims: {claimCount}/50 {claimCount >= 50 && "(Paused)"}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 rounded-xl p-4 border border-green-800/20 space-y-3 animate-pop-bounce-3">
          <h4 className="text-sm text-white font-semibold">Quick Actions</h4>
          <div className="flex flex-col gap-2 w-full">
            {menuItems.map((item, idx) => {
              const Icon = item.icon
              const key = `qa-${idx}`
              const content = (
                <div style={{ animationDelay: `${idx * 80}ms` }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/6 transition transform hover:-translate-y-1 hover:scale-102 active:scale-95">
                  <div className={`w-10 h-10 flex items-center justify-center ${item.color} rounded-md shrink-0`}>
                    {item.emoji ? <span className="text-xl">{item.emoji}</span> : Icon && <Icon size={20} />}
                  </div>
                  <div className="text-sm font-medium text-white">{item.name}</div>
                </div>
              )

              return item.external ? (
                <a key={key} href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full focus:outline-none">
                  {content}
                </a>
              ) : (
                <Link key={key} href={item.link || "#"} className="block w-full focus:outline-none">
                  {content}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white/5 rounded-xl p-4 border border-green-800/20 animate-pop-bounce-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white font-semibold">Help & Support</div>
              <div className="text-xs text-tiv-3">24/7 support</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="https://t.me/Tivexx9jasupport" target="_blank">
                <Button className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95">
                  <Headphones className="h-5 w-5 text-white" />
                </Button>
              </Link>
              <Link href="https://t.me/Tivexx9jacommunity" target="_blank">
                <Button className="h-10 w-10 rounded-full bg-tiv-2 hover:opacity-95 active:scale-95 relative">
                  <Bell className="h-5 w-5 text-white" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Referral Card */}
        <div className="animate-pop-bounce-4">
          {userData && <ReferralCard userId={userData.id || userData.userId} />}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-gray-900 via-green-900 to-black border-t border-green-800/30 shadow-lg flex justify-around items-center h-16 max-w-md mx-auto z-50">
        <Link href="/dashboard" className="flex flex-col items-center text-tiv-3">
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/abouttivexx" className="flex flex-col items-center text-gray-400 hover:text-green-400">
          <Gamepad2 className="h-6 w-6" />
          <span className="text-xs font-medium">About Helping Hands</span>
        </Link>
        <Link href="/refer" className="flex flex-col items-center text-gray-400 hover:text-green-400">
          <User className="h-6 w-6" />
          <span className="text-xs font-medium">Refer & Earn</span>
        </Link>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        @keyframes glow-swipe {
          0% {
            opacity: 0.7;
            transform: translateX(-10%);
            filter: blur(10px);
          }
          50% {
            opacity: 1;
            transform: translateX(10%);
            filter: blur(18px);
          }
          100% {
            opacity: 0.7;
            transform: translateX(-10%);
            filter: blur(10px);
          }
        }

        @keyframes shimmer {
          0% {
            left: -120%;
          }
          50% {
            left: 120%;
          }
          100% {
            left: -120%;
          }
        }

        /* Stronger entry + micro-interaction utils */
        @keyframes pop-in {
          0% { opacity: 0; transform: translateY(12px) scale(.995); }
          60% { opacity: 1; transform: translateY(-6px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-pop-in {
          animation: pop-in .45s cubic-bezier(.2,.9,.2,1) both;
        }

        /* Distinct gentle bounce variants for each dashboard box */
        @keyframes bounce-1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes bounce-2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce-3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes bounce-4 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes bounce-5 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        /* Combined entry + per-card continuous bounce with small staggered delays */
        .animate-pop-bounce-1 { animation: pop-in .45s cubic-bezier(.2,.9,.2,1) both, bounce-1 1.6s ease-in-out 0s infinite; }
        .animate-pop-bounce-2 { animation: pop-in .45s cubic-bezier(.2,.9,.2,1) both, bounce-2 1.9s ease-in-out 0.15s infinite; }
        .animate-pop-bounce-3 { animation: pop-in .45s cubic-bezier(.2,.9,.2,1) both, bounce-3 1.4s ease-in-out 0.3s infinite; }
        .animate-pop-bounce-4 { animation: pop-in .45s cubic-bezier(.2,.9,.2,1) both, bounce-4 2.1s ease-in-out 0.45s infinite; }
        .animate-pop-bounce-5 { animation: pop-in .45s cubic-bezier(.2,.9,.2,1) both, bounce-5 1.7s ease-in-out 0.6s infinite; }

        .hover-pop:hover { transform: translateY(-6px) scale(1.02); }

        /* Respect users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-pop-bounce-1,
          .animate-pop-bounce-2,
          .animate-pop-bounce-3,
          .animate-pop-bounce-4,
          .animate-pop-bounce-5,
          .animate-pop-in {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition: none !important;
          }
        }

        .active-squeeze:active {
          transform: scale(.97);
        }

        .transition-pop {
          transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
        }

        .hover-shadow:hover {
          box-shadow: 0 14px 40px rgba(0,0,0,0.55);
        }

        .scale-102 { transform: scale(1.02); }

        .why-glow {
          position: relative;
          overflow: hidden;
        }

        .why-glow::before {
          content: "";
          position: absolute;
          top: -25%;
          left: -25%;
          width: 150%;
          height: 150%;
          background: radial-gradient(circle at 20% 20%, rgba(34,197,94,0.10), transparent 8%),
                      radial-gradient(circle at 80% 80%, rgba(96,165,250,0.05), transparent 10%);
          filter: blur(22px);
          transform: translate3d(0,0,0);
          animation: glow-swipe 6s linear infinite;
          pointer-events: none;
        }

        .why-glow::after {
          content: "";
          position: absolute;
          top: -10%;
          left: -120%;
          width: 60%;
          height: 120%;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-20deg);
          filter: blur(6px);
          animation: shimmer 3.5s ease-in-out infinite;
          pointer-events: none;
        }

        .why-glow > * {
          position: relative;
          z-index: 1;
        }

        /* Ensure desktop view matches mobile */
        @media (min-width: 768px) {
          .max-w-md {
            max-width: 28rem !important;
          }
        }
      `}</style>
    </div>
  )
}