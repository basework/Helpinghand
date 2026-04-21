"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Zap, HandCoins, Sparkles, TrendingUp, Crown, Star, CircleDollarSign } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const MAX_ENERGY = 100
const EARN_PER_TAP = 100
const ENERGY_REGEN_MS = 60000 // 1 minute per energy unit
const STORAGE_KEY = "tap_earn_state"

interface TapParticle {
  id: number
  x: number
  y: number
  emoji: string
}

const TAP_EMOJIS = ["💰", "⚡", "✨", "💎", "🔥"]

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { energy: MAX_ENERGY, earned: 0, lastTime: Date.now() }
    const s = JSON.parse(raw)
    const elapsed = Date.now() - (s.lastTime || Date.now())
    const regen = Math.floor(elapsed / ENERGY_REGEN_MS)
    const energy = Math.min(MAX_ENERGY, (s.energy || 0) + regen)
    return { energy, earned: s.earned || 0, lastTime: Date.now() }
  } catch {
    return { energy: MAX_ENERGY, earned: 0, lastTime: Date.now() }
  }
}

export default function TapAndEarnPage() {
  const router = useRouter()
  const [state, setState] = useState(loadState)
  const [particles, setParticles] = useState<TapParticle[]>([])
  const [tapping, setTapping] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)
  const particleId = useRef(0)
  const syncTimeout = useRef<ReturnType<typeof setTimeout>>()
  const pendingSync = useRef(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastTime: Date.now() }))
  }, [state])

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.energy >= MAX_ENERGY) return prev
        return { ...prev, energy: Math.min(MAX_ENERGY, prev.energy + 1) }
      })
    }, ENERGY_REGEN_MS)
    return () => clearInterval(interval)
  }, [])

  const syncToDb = useCallback((amount: number) => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current)
    syncTimeout.current = setTimeout(async () => {
      try {
        const user = JSON.parse(localStorage.getItem("tivexx-user") || "{}")
        if (user.id) {
          // Update user balance
          const currentUser = JSON.parse(localStorage.getItem("tivexx-user") || "{}")
          currentUser.balance = (currentUser.balance || 0) + amount
          localStorage.setItem("tivexx-user", JSON.stringify(currentUser))
        }
        pendingSync.current = 0
      } catch (error) {
        console.error("Sync error:", error)
      }
    }, 1500)
  }, [])

  const handleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (state.energy <= 0) {
        setShowPrompt(true)
        return
      }

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      let clientX: number, clientY: number
      if ("touches" in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const id = particleId.current++
      const emoji = TAP_EMOJIS[id % TAP_EMOJIS.length]
      setParticles(prev => [...prev, { id, x: clientX - rect.left, y: clientY - rect.top, emoji }])
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 900)

      setTapping(true)
      setTapCount(prev => prev + 1)
      setTimeout(() => setTapping(false), 120)

      setState(prev => ({
        ...prev,
        energy: prev.energy - 1,
        earned: prev.earned + EARN_PER_TAP,
      }))

      pendingSync.current += EARN_PER_TAP
      syncToDb(pendingSync.current)
    },
    [state.energy, syncToDb]
  )

  const energyPercent = (state.energy / MAX_ENERGY) * 100

  if (!mounted) return null

  return (
    <div className="min-h-screen pb-28 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="hh-bubbles-container">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`hh-bubble hh-bubble-${i + 1}`}></div>
          ))}
        </div>
        <div className="hh-mesh-overlay"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-20 px-6 py-6 flex items-center gap-4 bg-gradient-to-b from-[#050d14]/95 to-[#050d14]/80 backdrop-blur-md border-b border-emerald-500/15"
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="p-2.5 rounded-12 bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black tracking-tight text-white">Tap & Earn</h1>
          <p className="text-xs text-emerald-400/80 tracking-wide flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" />
            ₦{EARN_PER_TAP} per tap
          </p>
        </div>
      </motion.header>

      {/* Stats Row */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 px-4 mb-6 mt-4 grid grid-cols-3 gap-3"
      >
        <div className="glass-card p-4 text-center rounded-16 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
          <CircleDollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <p className="text-xl font-black text-white">₦{state.earned.toLocaleString()}</p>
          <p className="text-xs uppercase tracking-wider text-emerald-300/60 font-bold mt-1">Earned</p>
        </div>
        <div className="glass-card p-4 text-center rounded-16 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
          <TrendingUp className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <p className="text-xl font-black text-white">{tapCount}</p>
          <p className="text-xs uppercase tracking-wider text-amber-300/60 font-bold mt-1">Taps</p>
        </div>
        <div className="glass-card p-4 text-center rounded-16 border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-violet-500/5">
          <Crown className="w-5 h-5 text-violet-400 mx-auto mb-2" />
          <p className="text-xl font-black text-white">₦{EARN_PER_TAP}</p>
          <p className="text-xs uppercase tracking-wider text-violet-300/60 font-bold mt-1">Per Tap</p>
        </div>
      </motion.div>

      {/* Main tap area */}
      <div className="flex-1 relative z-10 flex items-center justify-center px-4 py-8">
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: "-40px",
              border: "2px dashed rgba(16, 185, 129, 0.2)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Mid rotating ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: "-25px",
              border: "1px solid rgba(16, 185, 129, 0.15)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: tapping
                ? [
                    "0 0 60px 25px rgba(16, 185, 129, 0.5), 0 0 120px 50px rgba(16, 185, 129, 0.2)",
                    "0 0 80px 35px rgba(16, 185, 129, 0.4), 0 0 140px 60px rgba(16, 185, 129, 0.15)",
                  ]
                : "0 0 40px 12px rgba(16, 185, 129, 0.25), 0 0 80px 25px rgba(16, 185, 129, 0.1)",
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Breathing pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid rgba(16, 185, 129, 0.3)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Second pulse ring offset */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(16, 185, 129, 0.2)" }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />

          {/* The orb */}
          <motion.button
            onClick={(e) => {
              if (state.energy <= 0) {
                setShowPrompt(true)
              } else {
                handleTap(e)
              }
            }}
            className={`relative w-56 h-56 rounded-full select-none outline-none border-none font-black ${
              state.energy > 0 ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            style={{
              background:
                state.energy > 0
                  ? "radial-gradient(circle at 38% 32%, rgba(16, 185, 129, 0.9), rgb(16, 185, 129) 45%, rgba(16, 185, 129, 0.8) 100%)"
                  : "radial-gradient(circle at 38% 32%, rgba(107, 114, 128, 0.6), rgba(55, 65, 81, 0.8) 100%)",
              boxShadow:
                state.energy > 0
                  ? "inset 0 -10px 25px rgba(16, 185, 129, 0.6), inset 0 5px 20px rgba(52, 211, 153, 0.3), 0 0 60px rgba(16, 185, 129, 0.4)"
                  : "inset 0 -8px 20px rgba(0, 0, 0, 0.5)",
              opacity: state.energy > 0 ? 1 : 0.5,
            }}
            whileTap={state.energy > 0 ? { scale: 0.9 } : {}}
            animate={{ scale: tapping ? 0.9 : 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {/* Glass shine */}
            <div
              className="absolute top-5 left-10 w-20 h-10 rounded-full opacity-30"
              style={{
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.8), transparent)",
                filter: "blur(8px)",
              }}
            />

            {/* Shimmer sweep */}
            <motion.div className="absolute inset-0 rounded-full overflow-hidden" style={{ opacity: 0.15 }}>
              <motion.div
                className="absolute w-full h-full"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              />
            </motion.div>

            {/* Center icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <motion.div
                animate={{ y: [0, -4, 0], rotateZ: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <HandCoins className="w-16 h-16 text-white" strokeWidth={1.5} />
              </motion.div>
              <motion.span
                className="text-xs font-black text-white/70 uppercase tracking-widest"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                TAP
              </motion.span>
            </div>

            {/* Orbiting stars */}
            {[0, 120, 240].map((deg, i) => (
              <motion.div
                key={deg}
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
              >
                <Star
                  className="text-amber-400/40"
                  size={12}
                  fill="currentColor"
                  style={{
                    transform: `rotate(${deg}deg) translateX(${90 + i * 8}px) rotate(-${deg}deg)`,
                  }}
                />
              </motion.div>
            ))}

            {/* Tap particles */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute pointer-events-none flex flex-col items-center"
                  initial={{ x: p.x - 24, y: p.y - 12, opacity: 1, scale: 0.6 }}
                  animate={{ y: p.y - 70, opacity: 0, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <span className="font-black text-lg text-emerald-400">+₦{EARN_PER_TAP}</span>
                  <span className="text-lg">{p.emoji}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Energy bar section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 px-4 pb-8 pt-4"
      >
        <div className="rounded-20 p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Zap className="w-5 h-5 text-amber-400" fill="currentColor" />
              </motion.div>
              <span className="text-sm text-white font-bold">Energy</span>
            </div>
            <span className="font-black text-lg">
              <span
                className={
                  state.energy <= 10 ? "text-red-400" : state.energy <= 30 ? "text-amber-400" : "text-emerald-400"
                }
              >
                {state.energy}
              </span>
              <span className="text-white/50"> / {MAX_ENERGY}</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden relative border border-white/10">
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                background:
                  energyPercent > 30
                    ? "linear-gradient(90deg, rgb(16, 185, 129), rgb(52, 211, 153))"
                    : energyPercent > 10
                    ? "linear-gradient(90deg, rgb(251, 191, 36), rgb(245, 158, 11))"
                    : "linear-gradient(90deg, rgb(239, 68, 68), rgb(220, 38, 38))",
              }}
              animate={{ width: `${energyPercent}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {/* Shimmer on bar */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-white/60 font-semibold">
              Earning Rate:{" "}
              <span className="text-emerald-400 font-black">₦{EARN_PER_TAP.toLocaleString()}</span> per tap
            </p>
            {state.energy < MAX_ENERGY && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-amber-400 flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3" />
                Recharging...
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Energy Depleted Modal */}
      <AnimatePresence>
        {showPrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrompt(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90%] z-50"
            >
              <div className="rounded-24 p-6 border border-amber-500/30 bg-gradient-to-br from-[#050d14] via-[#051118] to-[#050d14] shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-amber-400" fill="currentColor" />
                  <h2 className="text-2xl font-black text-white">Energy Depleted!</h2>
                </div>
                <p className="text-sm text-white/70 mb-6 leading-relaxed">
                  You've used all your taps. Complete tasks to earn more energy or wait for it to recharge automatically!
                </p>

                <div className="flex flex-col gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowPrompt(false)
                      router.push("/task")
                    }}
                    className="w-full py-3 rounded-14 font-black text-sm tracking-wide text-white flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    <Star className="w-4 h-4" /> Complete Tasks
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPrompt(false)}
                    className="w-full py-3 rounded-14 font-black text-sm tracking-wide border-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition-all"
                  >
                    Come Back Later
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Import existing styles */
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&display=swap");

        /* ─── BUBBLES ─── */
        .hh-bubbles-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .hh-bubble {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          animation: hh-bubble-rise linear infinite;
        }

        .hh-bubble-1 {
          width: 8px;
          height: 8px;
          left: 10%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.6), transparent);
          animation-duration: 8s;
          animation-delay: 0s;
        }
        .hh-bubble-2 {
          width: 14px;
          height: 14px;
          left: 25%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.5), transparent);
          animation-duration: 11s;
          animation-delay: 1.5s;
        }
        .hh-bubble-3 {
          width: 6px;
          height: 6px;
          left: 40%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.7), transparent);
          animation-duration: 9s;
          animation-delay: 3s;
        }
        .hh-bubble-4 {
          width: 18px;
          height: 18px;
          left: 55%;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.4), transparent);
          animation-duration: 13s;
          animation-delay: 0.5s;
        }
        .hh-bubble-5 {
          width: 10px;
          height: 10px;
          left: 70%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.5), transparent);
          animation-duration: 10s;
          animation-delay: 2s;
        }
        .hh-bubble-6 {
          width: 5px;
          height: 5px;
          left: 82%;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.8), transparent);
          animation-duration: 7s;
          animation-delay: 4s;
        }
        .hh-bubble-7 {
          width: 12px;
          height: 12px;
          left: 15%;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.4), transparent);
          animation-duration: 12s;
          animation-delay: 5s;
        }
        .hh-bubble-8 {
          width: 7px;
          height: 7px;
          left: 35%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.6), transparent);
          animation-duration: 9.5s;
          animation-delay: 2.5s;
        }

        @keyframes hh-bubble-rise {
          0% {
            transform: translateY(100vh) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-10vh) scale(1.2);
            opacity: 0;
          }
        }

        /* ─── MESH OVERLAY ─── */
        .hh-mesh-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse 60% 40% at 20% 80%, rgba(16, 185, 129, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 20%, rgba(251, 191, 36, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(245, 158, 11, 0.03) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
    </div>
  )
}
