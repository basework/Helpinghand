"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTaskTimer } from "@/hooks/useTaskTimer"

interface Task {
  id: string
  platform: string
  description: string
  category: string
  reward: number
  link: string
  icon: string
}

const AVAILABLE_TASKS: Task[] = [
  
  {
    id: "Monetage-our-most-earned-spin-to-win-ad",
    platform: "Partnership ads 1",
    description: "Tap our premium ad link for extra rewards",
    category: "Ads",
    reward: 3000,
    link: "https://spin-to-win-hub-6676aed7.vercel.app/",
    icon: "📢",
  },
  {
    id: "Telegram Channel Task 01",
    platform: "Partnership ads 2",
    description: "Tap our premium ad link for extra rewards",
    category: "Social Media",
    reward: 3000,
    link: "https://bloggersin.vercel.app/",
    icon: "💬",
  },
   {
     id: "effectivegatecpm-ad",
     platform: "Partnership ads 3",
     description: "Tap our ad link to earn Extra money",
     category: "Advertisement",
     reward: 3000,
      link: "https://otieu.com/4/10575212",
     icon: "🎯",
   },
   {
     id: "effectivegatecpm-ad-2",
     platform: "Partnership ads 4",
     description: "Tap our premium ad link for extra rewards",
     category: "Advertisement",
     reward: 3000,
      link: "https://spin-to-win-hub-6676aed7.vercel.app/",
     icon: "🎁",
   },
   {
     id: "spin-to-win-hub",
     platform: "Partnership ads 5",
     description: "Tap our premium ad link for extra rewards",
     category: "Advertisement",
     reward: 3000,
      link: "https://spin-to-win-hub-6676aed7.vercel.app/",
     icon: "🎡",
   },
   {
     id: "Winners hub",
     platform: "Partnership ads 6",
     description: "Tap our ad link to earn Extra money",
     category: "Advertisement",
     reward: 3000,
     link: "https://spin-to-win-hub-6676aed7.vercel.app/",
     icon: "💸💲",
   },
  {
    id: "Join Nova Cash",
    platform: "Partnership ads 7",
    description: "Join Nova Cash",
    category: "Social Media",
    reward: 3000,
    link: "https://spin-to-win-hub-6676aed7.vercel.app/",
    icon: "🎵",
  },
  {
    id: "Telegram Channel Task 02",
    platform: "Partnership ads 8",
    description: "Tap our premium ad link for extra rewards",
    category: "Social Media",
    reward: 3000,
    link: "https://spin-to-win-hub-6676aed7.vercel.app/",
    icon: "🤖",
  },
  {
    id: "facebook page",
    platform: "Partnership ads 9",
    description: "Tap our premium ad link for extra rewards",
    category: "Tasks",
    reward: 3000,
    link: "https://spin-to-win-hub-6676aed7.vercel.app/",
    icon: "🎁",
  },
  
  {
    id: " Task 03",
    platform: "Partnership ads 10",
    description: "Tap our premium ad link for extra rewards",
    category: "Survey",
    reward: 3000,
    link: "https://otieu.com/4/10575212",
    icon: "🌐",
  },
]

export default function TaskPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [balance, setBalance] = useState(0)
  const [verifyingTasks, setVerifyingTasks] = useState<Record<string, {progress: number, startTime: number}>>({})
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({})
  const progressIntervals = useRef<Record<string, NodeJS.Timeout>>({})

  // Load user and tasks
  useEffect(() => {
    const storedUser = localStorage.getItem("tivexx-user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUser)
    setBalance(user.balance || 0)

    const completed = JSON.parse(localStorage.getItem("tivexx-completed-tasks") || "[]")
    setCompletedTasks(completed)

    const savedCooldowns = JSON.parse(localStorage.getItem("tivexx-task-cooldowns") || "{}")
    
    // Check if tasks should reset (daily reset at midnight)
    const lastResetDate = localStorage.getItem("tivexx-last-reset-date")
    const today = new Date().toDateString()
    
    if (lastResetDate !== today) {
      // Reset all tasks for the new day
      setCompletedTasks([])
      setCooldowns({})
      setVerifyingTasks({})
      localStorage.setItem("tivexx-completed-tasks", "[]")
      localStorage.setItem("tivexx-task-cooldowns", "{}")
      localStorage.setItem("tivexx-last-reset-date", today)
    } else {
      setCooldowns(savedCooldowns)
    }
  }, [router])

  // Initialize task timer hook
  const { attachFocusListener, startTaskTimer } = useTaskTimer()

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(progressIntervals.current).forEach(interval => {
        clearInterval(interval)
      })
    }
  }, [])

  // Set up focus listener on mount
  useEffect(() => {
    const detach = attachFocusListener(
      // onTaskSuccess callback
      (taskId: string, elapsed: number) => {
        // When returning from external site, sessionStorage indicates the task
        // was started. We should credit the reward even if in-memory verifying
        // state was lost (navigation/mount). Guard against double-crediting
        // by checking completedTasks.
        if (!completedTasks.includes(taskId)) {
          completeVerification(taskId)
          toast({
            title: "Task Completed 🎉",
            description: "Reward has been added to your balance!",
          })
        }
      },
      // onTaskIncomplete callback
      (taskId: string, elapsed: number) => {
        // Clear verifying state when task is incomplete
        setVerifyingTasks(prev => {
          const newState = { ...prev }
          delete newState[taskId]
          return newState
        })
        
        // Clear interval
        if (progressIntervals.current[taskId]) {
          clearInterval(progressIntervals.current[taskId])
          delete progressIntervals.current[taskId]
        }
        
        // Show specific prompt based on time spent
        const timeSpent = Math.round(elapsed)
        if (timeSpent < 10) {
          toast({
            title: "Not Enough Time Spent ⏱️",
            description: `You only spent ${timeSpent} seconds on the site. Please spend at least 10 seconds interacting with the external site to complete this task. Try again!`,
            variant: "destructive",
            duration: 5000,
          })
        } else {
          toast({
            title: "Incomplete Task ⚠️",
            description: "The task was not completed successfully. Please try again!",
            variant: "destructive",
            duration: 5000,
          })
        }
      },
      // isTaskCompleted checker
      (taskId: string) => {
        return completedTasks.includes(taskId)
      }
    )
    return detach
  }, [completedTasks, verifyingTasks, toast])

  // Start progress animation for a specific task
  const startProgressAnimation = (taskId: string) => {
    // Clear any existing interval for this task
    if (progressIntervals.current[taskId]) {
      clearInterval(progressIntervals.current[taskId])
    }
    
    const startTime = Date.now()
    
    // Update verifying tasks state with start time
    setVerifyingTasks(prev => ({
      ...prev,
      [taskId]: {
        progress: 0,
        startTime
      }
    }))
    
    // Start progress interval
    const interval = setInterval(() => {
      setVerifyingTasks(prev => {
        if (!prev[taskId]) return prev
        
        const elapsed = (Date.now() - prev[taskId].startTime) / 1000
        const newProgress = Math.min((elapsed / 20) * 100, 100)
        
        // Clear interval if progress reaches 100%
        if (newProgress >= 100) {
          clearInterval(progressIntervals.current[taskId])
          delete progressIntervals.current[taskId]
        }
        
        return {
          ...prev,
          [taskId]: {
            ...prev[taskId],
            progress: newProgress
          }
        }
      })
    }, 1000)
    
    progressIntervals.current[taskId] = interval
  }

  // Countdown for cooldowns
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const updated = { ...cooldowns }
      let changed = false

      Object.keys(updated).forEach((key) => {
        if (updated[key] > now) {
          updated[key] -= 1000
          changed = true
        } else {
          delete updated[key]
          changed = true
        }
      })

      if (changed) {
        setCooldowns({ ...updated })
        localStorage.setItem("tivexx-task-cooldowns", JSON.stringify(updated))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldowns])

  const completeVerification = async (taskId: string) => {
    const task = AVAILABLE_TASKS.find((t) => t.id === taskId)
    if (!task) return

    const newBalance = balance + task.reward
    setBalance(newBalance)

    const storedUser = localStorage.getItem("tivexx-user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      user.balance = newBalance
      localStorage.setItem("tivexx-user", JSON.stringify(user))
      // Sync balance to server so DB triggers (referral processing) run
      try {
        await fetch(`/api/user-balance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id || user.user_id || user.userId, balance: newBalance }),
        })
      } catch (err) {
        console.error("Failed to sync user balance to server:", err)
      }
    }

    const newCompleted = [...completedTasks, task.id]
    setCompletedTasks(newCompleted)
    localStorage.setItem("tivexx-completed-tasks", JSON.stringify(newCompleted))

    // Calculate time until midnight
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()
    
    const newCooldowns = { ...cooldowns, [task.id]: now.getTime() + timeUntilMidnight }
    setCooldowns(newCooldowns)
    localStorage.setItem("tivexx-task-cooldowns", JSON.stringify(newCooldowns))

    // Remove from verifying tasks
    setVerifyingTasks(prev => {
      const newState = { ...prev }
      delete newState[taskId]
      return newState
    })
    
    // Clear interval
    if (progressIntervals.current[taskId]) {
      clearInterval(progressIntervals.current[taskId])
      delete progressIntervals.current[taskId]
    }

    toast({
      title: "Reward Credited 🎉",
      description: `₦${task.reward.toLocaleString()} has been added to your balance.`,
    })

    // Coin rain animation
    const container = document.createElement("div")
    container.className = "coin-rain"
    document.body.appendChild(container)
    for (let i = 0; i < 30; i++) {
      const coin = document.createElement("div")
      coin.className = "coin"
      coin.style.left = `${Math.random() * 100}vw`
      coin.style.animationDelay = `${Math.random() * 2}s`
      container.appendChild(coin)
    }
    setTimeout(() => container.remove(), 3000)
  }

  const handleTaskClick = (task: Task) => {
    if (completedTasks.includes(task.id)) {
      toast({
        title: "Task Already Completed",
        description: "You have already earned the reward for this task.",
        variant: "destructive",
      })
      return
    }

    if (cooldowns[task.id] && cooldowns[task.id] > Date.now()) {
      toast({
        title: "Task on Cooldown",
        description: "You can only do this task once every 24 hours.",
        variant: "destructive",
      })
      return
    }

    if (!task.link) {
      toast({
        title: "No link set",
        description: "This task doesn't have a link yet. Please add one before attempting.",
        variant: "destructive",
      })
      return
    }

    // Show warning message about 10-second requirement
    toast({
      title: "Task Started ⏱️",
      description: "Make sure to spend at least 10 seconds on the site before returning. If you return too quickly, you'll need to try again!",
      duration: 5000,
    })

    // Start progress animation for this specific task
    startProgressAnimation(task.id)
    // Start persistent session timer so returning focus can verify completion
    try {
      startTaskTimer(task.id)
    } catch (e) {
      console.error("Failed to start task timer:", e)
    }
    
    // Navigate in the same tab
    window.location.href = task.link
  }

  return (
    <div className="min-h-screen liquid-bg pb-20">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Daily Tasks</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-bold mb-2 text-white">Earn Extra Rewards</h2>
          <p className="text-sm text-white/80">Complete tasks to earn bonus credits and boost your earnings</p>
        </div>

        {AVAILABLE_TASKS.map((task) => {
          const isVerifying = verifyingTasks[task.id] !== undefined
          const progress = isVerifying ? verifyingTasks[task.id].progress : 0
          const cooldown = cooldowns[task.id]
          const isCompleted = completedTasks.includes(task.id)
          const isPending = verifyingTasks[task.id] !== undefined
          const isProcessing = isVerifying
          const timeLeft = cooldown ? cooldown - Date.now() : 0

          const formatTime = (ms: number) => {
            if (ms <= 0) return "now"
            const totalSeconds = Math.floor(ms / 1000)
            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60
            return `${hours > 0 ? hours + "h " : ""}${minutes}m ${seconds}s`
          }

          return (
            <div key={task.id}>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 text-white">{task.platform}</h3>
                    <p className="text-sm text-white/80 mb-3">{task.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-amber-300">₦{task.reward.toLocaleString()}</span>
                      <span className="text-xs text-white/70">reward</span>
                      {isPending && (
                        <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">⏳ Pending Verification</span>
                      )}
                      {isCompleted && !isPending && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">✓ Claimed Today</span>
                      )}
                      {isProcessing && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Processing...</span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleTaskClick(task)}
                    disabled={isCompleted || isProcessing}
                    className={`px-6 py-3 font-bold whitespace-nowrap ${
                      isCompleted
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : isPending
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : isProcessing
                        ? 'bg-blue-400 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : isPending ? 'Verify & Claim' : isCompleted ? 'Claimed Today' : 'Claim Now'}
                  </Button>
                </div>

                {isVerifying && (
                  <div className="relative w-full mt-4 bg-white/10 h-6 rounded-xl overflow-hidden border border-white/20">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-600 via-green-500 to-green-400"
                      style={{ width: `${progress}%` }}
                    />
                    <p className="absolute inset-0 flex justify-center items-center text-sm font-semibold text-white drop-shadow-[0_0_3px_rgba(0,0,0,0.7)]">
                      Verifying... {Math.floor(progress)}%
                    </p>
                  </div>
                )}

                {cooldown && timeLeft > 0 && (
                  <Button disabled className="w-full mt-4 bg-white/10 text-white/70 cursor-not-allowed font-semibold py-3 rounded-lg border border-white/20">
                    Available in: {formatTime(timeLeft)}
                  </Button>
                )}
              </div>

              {task.link && task.id.includes('ad') && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 mt-2 rounded-lg">
                  <p className="text-xs text-yellow-700">⚠️ <strong>Important:</strong> Allow the page to load completely before closing to receive your full reward.</p>
                </div>
              )}
            </div>
          );
        })}

        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <p className="text-sm text-center text-white/80">Tasks reset every day at midnight. Check back tomorrow for more rewards!</p>
        </div>
      </div>
    </div>
  )
}