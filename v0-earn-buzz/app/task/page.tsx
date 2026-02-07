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
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black pb-20 relative">
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center mb-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 mr-2">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Available Tasks</h1>
        </div>
        <p className="text-green-100 text-center">Earn Rewards Per Task</p>
        <p className="text-xs text-white/70 text-center mt-2">NB: For ad tasks, please spend at least 10 seconds on the opened site before returning.</p>
      </div>

      <div className="px-4 mt-6 space-y-4">
        {AVAILABLE_TASKS.map((task) => {
          const isVerifying = verifyingTasks[task.id] !== undefined
          const progress = isVerifying ? verifyingTasks[task.id].progress : 0
          const cooldown = cooldowns[task.id]
          const isCompleted = completedTasks.includes(task.id)

          const timeLeft = cooldown
            ? cooldown - Date.now()
            : 0

          const formatTime = (ms: number) => {
            if (ms <= 0) return "now"
            const totalSeconds = Math.floor(ms / 1000)
            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60
            return `${hours > 0 ? hours + "h " : ""}${minutes}m ${seconds}s`
          }

          return (
            <div key={task.id} className="task-float">
              <div className="bg-white/6 backdrop-blur-lg rounded-2xl p-5 border border-white/8 shadow-lg task-float__inner">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{task.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{task.platform}</h3>
                    <p className="text-sm text-white/80 mt-1">{task.description}</p>
                    <p className="text-xs text-emerald-200 mt-1">{task.category}</p>
                    <p className="text-xl font-bold text-amber-300 mt-2">
                      ₦{task.reward.toLocaleString()}
                    </p>
                  </div>
                </div>

                {isVerifying ? (
                  <div className="relative w-full mt-4 bg-white/10 h-6 rounded-xl overflow-hidden border border-white/8">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 animate-liquid-flow"
                      style={{ width: `${progress}%` }}
                    />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="bubble delay-0"></div>
                      <div className="bubble delay-1"></div>
                      <div className="bubble delay-2"></div>
                      <div className="bubble delay-3"></div>
                    </div>
                    <p className="absolute inset-0 flex justify-center items-center text-sm font-semibold text-white drop-shadow-[0_0_3px_rgba(0,0,0,0.7)]">
                      Verifying... {Math.floor(progress)}%
                    </p>
                  </div>
                ) : cooldown && timeLeft > 0 ? (
                  <Button
                    disabled
                    className="w-full mt-4 bg-white/10 text-white/70 cursor-not-allowed font-semibold py-3 rounded-xl flex items-center justify-center gap-2 border border-white/8"
                  >
                    Available in: {formatTime(timeLeft)}
                  </Button>
                ) : isCompleted ? (
                  <Button
                    disabled
                    className="w-full mt-4 bg-white/10 cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 border border-white/8"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Completed
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleTaskClick(task)}
                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 border border-green-500/20"
                  >
                    Start Task
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional UI element to remind users about the 10-second requirement */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-10">
        <div className="bg-gradient-to-r from-amber-600/90 to-amber-700/90 backdrop-blur-sm text-white p-3 rounded-xl border border-amber-500/30 shadow-lg animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <div className="text-lg">⏱️</div>
            <div className="text-sm font-medium">
              <span className="font-bold">Remember:</span> Stay and interact with the external site for at least 10 seconds else you wont be rewarded for the task!
            </div>
          </div>
        </div>
      </div>

      {/* Styles for animations */}
      <style jsx global>{`
        @keyframes liquid-flow {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .animate-liquid-flow {
          background-size: 1000px 100%;
          animation: liquid-flow 2s linear infinite;
          filter: drop-shadow(0 0 6px rgba(22,163,74,0.7));
        }

        /* Task float (faster) + hover color + quicker press-squeeze */
        @keyframes taskFloatY {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        .task-float {
          animation: taskFloatY 3.8s ease-in-out infinite;
          will-change: transform;
          display: block;
        }
        /* Slight per-item variation for organic motion */
        .task-float:nth-child(odd) { animation-duration: 3.6s; }
        .task-float:nth-child(3n) { animation-duration: 4.1s; }

        .task-float__inner {
          transition: transform 180ms cubic-bezier(.2,.8,.2,1), background-color 180ms ease, box-shadow 180ms ease;
          transform-origin: center;
          will-change: transform;
        }
        /* Hover/focus changes color and shadow, reverts on mouse leave */
        .task-float:hover .task-float__inner,
        .task-float:focus-within .task-float__inner {
          background-color: rgba(255,255,255,0.12);
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
          transform: translateY(-2px);
        }

        /* Faster, snappier press squeeze */
        .task-float:active .task-float__inner {
          transform: scale(0.96) translateY(4px);
        }
        .task-float:focus-within .task-float__inner {
          transform: scale(0.98) translateY(2px);
        }

        .bubble {
          position: absolute;
          bottom: 0;
          width: 8px;
          height: 8px;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          left: calc(10% + 80% * var(--x));
          animation: bubble-rise 3s infinite;
        }
        .bubble.delay-0 {
          --x: 0.1;
          animation-delay: 0s;
        }
        .bubble.delay-1 {
          --x: 0.4;
          animation-delay: 0.5s;
        }
        .bubble.delay-2 {
          --x: 0.7;
          animation-delay: 1s;
        }
        .bubble.delay-3 {
          --x: 0.9;
          animation-delay: 1.5s;
        }
        @keyframes bubble-rise {
          0% {
            transform: translateY(100%) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100%) scale(1);
            opacity: 0;
          }
        }
        /* Coin rain */
        .coin-rain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 9999;
        }
        .coin {
          position: absolute;
          top: -10px;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, #ffd700 40%, #f5b800 100%);
          border-radius: 50%;
          animation: coin-fall 2.5s linear forwards;
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
        }
        @keyframes coin-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}