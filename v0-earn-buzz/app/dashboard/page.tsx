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
  const [balance, setBalance] = useState(100000)
  const [animatedBalance, setAnimatedBalance] = useState(100000)
  const [isBalanceChanging, setIsBalanceChanging] = useState(false)
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

  // Animate balance changes
  useEffect(() => {
    if (balance === animatedBalance) return
    
    const difference = balance - animatedBalance
    const steps = 30
    const increment = difference / steps
    
    setIsBalanceChanging(true)
    
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setAnimatedBalance(prev => {
        const newValue = prev + increment
        if (currentStep >= steps) {
          clearInterval(timer)
          setIsBalanceChanging(false)
          return balance
        }
        return Math.round(newValue)
      })
    }, 16) // ~60fps
    
    return () => clearInterval(timer)
  }, [balance])

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
    if (!showBalance) {
      return (
        <span className="tracking-widest">
          <span className="inline-block w-12 h-6 bg-white/20 rounded animate-pulse mr-1"></span>
          <span className="inline-block w-8 h-6 bg-white/20 rounded animate-pulse mr-1"></span>
          <span className="inline-block w-16 h-6 bg-white/20 rounded animate-pulse"></span>
        </span>
      )
    }

    // For Nigerian Naira with proper spacing
    const formatted = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)

    return (
      <span className={`font-mono ${isBalanceChanging ? 'text-green-300' : 'text-white'}`}>
        <span className="text-2xl align-top">₦</span>
        <span className="text-3xl font-bold tracking-tight ml-1">
          {formatted}
        </span>
        <span className="text-lg opacity-80 ml-0.5">
          {formatted.includes('.') ? formatted.split('.')[1] : '00'}
        </span>
      </span>
    )
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
      link: "https://t.me/helpinghandsnews",
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
      user.balance = 100000
    }

    if (!user.userId) {
      user.userId = `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    }

    const fetchUserBalance = async () => {
      try {
        const response = await fetch(`/api/user-balance?userId=${user.id || user.userId}&t=${Date.now()}`)
        const data = await response.json()
        
        // FIX 1: Use the HIGHER balance between localStorage and database (preserves claims)
        const localStorageBalance = user.balance || 100000
        const dbBalance = data.balance || 100000
        const baseBalance = Math.max(localStorageBalance, dbBalance)
        
        // FIX 2: Add referral earnings ONLY ONCE (no double-counting). But if referral already in DB main, skip re-add.
        const referralEarnings = data.referral_balance || 0
        const lastSyncedReferrals = localStorage.getItem("tivexx-last-synced-referrals") || "0"
        
        // Calculate NEW referral earnings since last sync
        const newReferralEarnings = referralEarnings - parseInt(lastSyncedReferrals)
        const totalBalance = baseBalance + Math.max(0, newReferralEarnings)
        
        // Update state with the correct total balance
        setBalance(totalBalance)
        setAnimatedBalance(totalBalance)
        
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
        setAnimatedBalance(user.balance)
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
    <div className="min-h-screen pb-4 bg-gradient-to-br from-gray-900 via-green-900 to-black relative overflow-hidden">
      {/* Ocean wave animation for entire page */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      
      <ScrollingText />

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
                window.open("https://t.me/helpinghandsnews")
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
      <div className="max-w-md mx-auto px-4 space-y-4 mt-6 relative z-10 animate-page-bounce">
        {/* Profile Card */}
          <div className="bg-gradient-to-br from-gray-900 via-green-900 to-black rounded-xl p-4 border border-green-800/30 shadow-lg animate-pop-bounce-1 animate-inner-bounce-child delay-0">
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

        {/* Enhanced Balance Card */}
        <div className="bg-gradient-to-br from-gray-900 via-green-900 to-black rounded-xl p-4 mt-4 shadow-lg border border-green-800/30 animate-pop-bounce-2 animate-inner-bounce-child delay-1 relative overflow-hidden">
          {/* Ocean wave animation ALSO in balance box */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
          
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Available Balance</span>
            </div>
            <button 
              className="text-gray-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              onClick={() => setShowBalance(!showBalance)}
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? (
                <div className="flex items-center gap-1 text-sm">
                  <span>👁️</span>
                  <span className="hidden sm:inline">Hide</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm">
                  <span>🙈</span>
                  <span className="hidden sm:inline">Show</span>
                </div>
              )}
            </button>
          </div>
          
          <div className="relative">
            <div className="text-3xl font-bold min-h-[3.5rem] flex items-center">
              {formatCurrency(animatedBalance)}
            </div>
            
            {isBalanceChanging && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-shimmer"></div>
            )}
          </div>
          
          <div className="mt-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                  <Gift className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Next Reward</div>
                  <div className="text-xs text-gray-300">Claim daily bonus</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-bold text-tiv-3 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {pauseEndTime ? formatPauseTime() : formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-gray-400">
                  {pauseEndTime ? 'Cooldown' : 'Time remaining'}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleClaim} 
              disabled={!canClaim && !pauseEndTime} 
              className={`
                w-full relative overflow-hidden group
                ${(canClaim || pauseEndTime) 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500' 
                  : 'bg-gray-700 cursor-not-allowed'
                } 
                text-white font-semibold py-3 rounded-lg
                transition-all duration-300 transform
                hover:scale-[1.02] active:scale-[0.98]
                disabled:transform-none disabled:hover:scale-100
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="flex items-center justify-center gap-2 relative">
                <Gift className="h-5 w-5" />
                <span className="text-base">
                  {pauseEndTime 
                    ? `Wait ${formatPauseTime()}` 
                    : canClaim 
                      ? 'Claim ₦1,000 Now' 
                      : `Wait ${formatTime(timeRemaining)}`
                  }
                </span>
              </div>
            </Button>
            
            {/* Claim Success Notification - MOVED HERE */}
            {showClaimSuccess && (
              <div className="absolute -top-4 left-0 right-0 z-50 pointer-events-none">
                <div className="relative max-w-xs mx-auto">
                  {/* Main notification */}
                  <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-4 shadow-2xl border border-emerald-400/30 backdrop-blur-sm animate-slide-up">
                    {/* Confetti particles */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 overflow-hidden">
                      <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full top-0 left-1/4 animate-confetti-1"></div>
                      <div className="absolute w-1.5 h-1.5 bg-pink-300 rounded-full top-0 left-1/2 animate-confetti-2"></div>
                      <div className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full top-0 left-3/4 animate-confetti-3"></div>
                    </div>
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg">
                        <span className="text-xl">🎉</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold mb-1 animate-fade-in">Success!</h3>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-xl font-bold text-yellow-300 animate-scale-in">₦1,000</span>
                        <span className="text-xs opacity-90">credited</span>
                      </div>
                      <p className="text-xs opacity-80">Balance updated</p>
                      
                      {/* Progress indicator */}
                      <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/50 rounded-full animate-progress"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400">
                Claims today: <span className="font-bold text-white">{claimCount}/50</span>
              </div>
              {claimCount >= 50 && (
                <div className="text-xs text-yellow-400 animate-pulse">
                  ⚠️ Limit reached
                </div>
              )}
            </div>
          </div>
          
          {/* Balance trend indicators */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="flex-1 text-center">
              <div className="text-xs text-gray-400">Daily Income</div>
              <div className="text-sm font-bold text-green-400">+₦{(claimCount * 1000).toLocaleString()}</div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex-1 text-center">
              <div className="text-xs text-gray-400">Available Claims</div>
              <div className="text-sm font-bold text-blue-400">{Math.max(0, 50 - claimCount)} left</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 rounded-xl p-4 border border-green-800/20 space-y-3 animate-pop-bounce-3 animate-inner-bounce-child delay-2">
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
                <a key={key} href={item.link} className="block w-full focus:outline-none">
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
        <div className="bg-white/5 rounded-xl p-4 border border-green-800/20 animate-pop-bounce-5 animate-inner-bounce-child delay-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white font-semibold">Help & Support</div>
              <div className="text-xs text-tiv-3">24/7 support</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="https://t.me/helpinghandsupport">
                <Button className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95">
                  <Headphones className="h-5 w-5 text-white" />
                </Button>
              </Link>
              <Link href="https://t.me/helpinghandsnews">
                <Button className="h-10 w-10 rounded-full bg-tiv-2 hover:opacity-95 active:scale-95 relative">
                  <Bell className="h-5 w-5 text-white" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Referral Card */}
        <div className="animate-pop-bounce-4 animate-inner-bounce-child delay-4">
          {userData && <ReferralCard userId={userData.id || userData.userId} />}
        </div>

        {/* History */}
        <div className="bg-white/5 rounded-xl p-4 border border-green-800/20 border-l-4 border-purple-600/60 pl-3 animate-pop-bounce-2 animate-inner-bounce-child delay-2 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-white font-semibold flex items-center gap-2">
                <History className="h-4 w-4 text-purple-300" />
                <span>Recent Activity</span>
              </div>
              <div className="text-xs text-tiv-3">Latest transactions</div>
            </div>
            <Link href="/history" className="text-sm text-purple-400 hover:underline font-medium">See more →</Link>
          </div>

          {transactions && transactions.length > 0 ? (
            <ul className="space-y-2">
              {transactions.slice(0, 3).map((tx: any) => (
                <li key={tx.id} className="flex items-center justify-between bg-white/3 p-3 rounded-md hover:bg-white/5 transition">
                  <div>
                    <div className="text-sm text-white font-medium">{tx.description}</div>
                    <div className="text-xs text-tiv-3">{new Date(tx.date).toLocaleString()}</div>
                  </div>
                  <div className={`text-sm font-semibold ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "credit" ? "+" : "-"}{tx.amount ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(tx.amount).replace("NGN", "₦") : ""}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-tiv-3">No history yet. Your transactions will appear here.</div>
          )}
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
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes coin-spin {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }

        .animate-coin-spin {
          animation: coin-spin 1s ease-out;
        }

        /* Stronger entry + micro-interaction utils */
        @keyframes pop-in {
          0% { opacity: 0; transform: translateY(12px) scale(.995); }
          60% { opacity: 1; transform: translateY(-6px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-pop-bounce-1 { animation: pop-in 0.4s ease-out; }
        .animate-pop-bounce-2 { animation: pop-in 0.5s ease-out; }
        .animate-pop-bounce-3 { animation: pop-in 0.6s ease-out; }
        .animate-pop-bounce-4 { animation: pop-in 0.7s ease-out; }
        .animate-pop-bounce-5 { animation: pop-in 0.8s ease-out; }

        /* New animations for the claim success notification */
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          70% {
            opacity: 1;
            transform: translateY(-5px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          70% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes confetti-1 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(30px) rotate(360deg); opacity: 0; }
        }

        @keyframes confetti-2 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(40px) rotate(-360deg); opacity: 0; }
        }

        @keyframes confetti-3 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(35px) rotate(180deg); opacity: 0; }
        }

        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out 0.1s both;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out 0.1s both;
        }

        .animate-progress {
          animation: progress 2.5s linear forwards;
        }

        .animate-confetti-1 {
          animation: confetti-1 0.8s ease-out forwards;
        }

        .animate-confetti-2 {
          animation: confetti-2 1s ease-out 0.1s forwards;
        }

        .animate-confetti-3 {
          animation: confetti-3 0.9s ease-out 0.2s forwards;
        }

        @keyframes gentleBouncePage {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes gentleBounceInner {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-page-bounce { animation: gentleBouncePage 1.2s ease-in-out infinite; }
        .animate-inner-bounce { animation: gentleBounceInner 1.3s ease-in-out infinite; }
        .animate-inner-bounce-child { animation: gentleBounceInner 1.3s ease-in-out infinite; }

        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }

        @media (prefers-reduced-motion: reduce) {
          .animate-page-bounce,
          .animate-inner-bounce,
          .animate-inner-bounce-child {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}