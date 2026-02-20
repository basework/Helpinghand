"use client"

import React, { useCallback, useEffect, useState, Component } from 'react'
// ─── Icon Components (lucide-react equivalents) ───────────────────────────────
const HomeIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const GamepadIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="2" />
  </svg>
)
const UserIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const BellIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const GiftIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
)
const ClockIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
const HeadphonesIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
)
const HistoryIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
    <path d="M12 7v5l4 2" />
  </svg>
)
const EyeIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const EyeOffIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)
const XIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const CopyIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
const CheckIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const TrendingUpIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)
const UsersIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const ShieldIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
// ─── Types ────────────────────────────────────────────────────────────────────
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
// ─── Modal Component ──────────────────────────────────────────────────────────
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  )
}
// ─── Scrolling Text ───────────────────────────────────────────────────────────
function ScrollingText() {
  const messages = [
    '🎉 Sarah K. just earned ₦1,000!',
    '💰 David L. withdrew ₦25,000 successfully!',
    '🚀 Maria R. earned ₦75,000 this week!',
    '✅ James O. completed 50 claims today!',
    '🌟 Amaka N. referred 10 friends and earned ₦50,000!',
  ]
  const text = messages.join('   •   ')
  return (
    <div className="overflow-hidden bg-emerald-950/60 border-b border-emerald-900/40 py-2 px-0">
      <div className="ticker-track">
        <span className="text-xs text-emerald-400 font-medium px-4">
          {text}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{text}
        </span>
      </div>
    </div>
  )
}
// ─── Withdrawal Notification ──────────────────────────────────────────────────
function WithdrawalNotification({ onClose }: { onClose: () => void }) {
  const names = [
    'Chidi A.',
    'Fatima B.',
    'Emeka O.',
    'Ngozi C.',
    'Tunde M.',
    'Aisha K.',
  ]
  const amounts = [5000, 10000, 15000, 25000, 50000, 7500]
  const name = names[Math.floor(Math.random() * names.length)]
  const amount = amounts[Math.floor(Math.random() * amounts.length)]
  useEffect(() => {
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-50 card-enter-1">
      <div className="glass-card glow-green p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 text-white font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-300 truncate">
            <span className="text-white font-semibold">{name}</span> just
            withdrew{' '}
            <span className="text-emerald-400 font-bold">
              ₦{amount.toLocaleString()}
            </span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Just now • Verified withdrawal
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
        >
          <XIcon size={16} />
        </button>
      </div>
    </div>
  )
}
// ─── Referral Card ────────────────────────────────────────────────────────────
function ReferralCard({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false)
  const referralLink = `helpinghandsapp.com/ref/${userId}`
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div
      className="glass-card p-4 space-y-4"
      style={{
        background:
          'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 100%)',
        border: '1px solid rgba(16,185,129,0.2)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Share & Grow</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Earn ₦5,000 per referral
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 dot-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Active</span>
        </div>
      </div>

      {/* Referral link */}
      <div className="flex items-center gap-2">
        <div
          className="flex-1 bg-black/30 border border-emerald-500/30 rounded-xl px-3 py-2.5 overflow-hidden"
          style={{
            boxShadow: '0 0 12px rgba(16,185,129,0.15)',
          }}
        >
          <p className="text-xs text-emerald-300 font-mono truncate">
            {referralLink}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 active:scale-95"
          style={{
            background: copied
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : 'linear-gradient(135deg, #10b981, #34d399)',
            boxShadow: '0 0 16px rgba(16,185,129,0.4)',
            color: 'white',
          }}
        >
          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 pt-1">
        {[
          {
            icon: '📨',
            label: 'Invite Friends',
            step: 'Step 1',
          },
          {
            icon: '✅',
            label: 'They Complete a Task',
            step: 'Step 2',
          },
          {
            icon: '💰',
            label: 'Get Paid ₦5,000',
            step: 'Step 3',
          },
        ].map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                style={{
                  background:
                    i === 1
                      ? 'linear-gradient(135deg, #10b981, #34d399)'
                      : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {s.icon}
              </div>
              <p className="text-[9px] text-slate-300 text-center leading-tight font-medium">
                {s.label}
              </p>
              <p className="text-[9px] text-emerald-500 font-semibold">
                {s.step}
              </p>
            </div>
            {i < 2 && <div className="step-line mx-1 mb-4" />}
          </div>
        ))}
      </div>

      {/* Share buttons */}
      <div className="flex gap-2 pt-1">
        <a
          href="https://t.me/share/url?url=https://helpinghandsapp.com/ref/${userId}"
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: 'rgba(37,99,235,0.2)',
            border: '1px solid rgba(37,99,235,0.3)',
            color: '#93c5fd',
          }}
        >
          Telegram
        </a>
        <a
          href={`https://wa.me/?text=Join%20Helping%20Hands%20and%20earn%20daily!%20https://helpinghandsapp.com/ref/${userId}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: 'rgba(22,163,74,0.2)',
            border: '1px solid rgba(22,163,74,0.3)',
            color: '#86efac',
          }}
        >
          WhatsApp
        </a>
        <button
          onClick={handleCopy}
          className="flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.25)',
            color: '#6ee7b7',
          }}
        >
          Copy Link
        </button>
      </div>
    </div>
  )
}
// ─── Tutorial Modal ───────────────────────────────────────────────────────────
function TutorialModal({ onClose }: { onClose: () => void }) {
  const steps = [
    {
      icon: '🎁',
      title: 'Claim Daily Rewards',
      desc: "Tap 'Claim ₦1,000 Now' every 60 seconds to earn up to ₦50,000 daily.",
    },
    {
      icon: '👥',
      title: 'Refer & Earn',
      desc: 'Share your referral link and earn ₦5,000 for every friend who joins.',
    },
    {
      icon: '💳',
      title: 'Take Loans',
      desc: 'Access instant loans to boost your earnings and repay easily.',
    },
    {
      icon: '💸',
      title: 'Withdraw Anytime',
      desc: 'Withdraw your earnings to your bank or mobile money account.',
    },
  ]
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-sm glass-card p-6 space-y-5"
        style={{
          border: '1px solid rgba(16,185,129,0.25)',
        }}
      >
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg"
            style={{
              boxShadow: '0 0 24px rgba(16,185,129,0.4)',
            }}
          >
            🌟
          </div>
          <h2 className="text-lg font-bold text-white">
            Welcome to Helping Hands!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Here's how to get started
          </p>
        </div>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="text-xl shrink-0">{s.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{s.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #059669, #10b981)',
            boxShadow: '0 0 20px rgba(16,185,129,0.35)',
          }}
        >
          Let's Get Started! 🚀
        </button>
      </div>
    </div>
  )
}
// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function App() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showBalance, setShowBalance] = useState(true)
  const [showWithdrawalNotification, setShowWithdrawalNotification] =
    useState(false)
  const [balance, setBalance] = useState(50000)
  const [animatedBalance, setAnimatedBalance] = useState(50000)
  const [isBalanceChanging, setIsBalanceChanging] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [canClaim, setCanClaim] = useState(true)
  const [isCounting, setIsCounting] = useState(false)
  const [displayedName, setDisplayedName] = useState('')
  const [nameIndex, setNameIndex] = useState(0)
  const [showTutorial, setShowTutorial] = useState(false)
  const [claimCount, setClaimCount] = useState(0)
  const [pauseEndTime, setPauseEndTime] = useState<number | null>(null)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [showClaimSuccess, setShowClaimSuccess] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  // ── Animate balance changes ──────────────────────────────────────────────
  useEffect(() => {
    if (balance === animatedBalance) return
    const difference = balance - animatedBalance
    const steps = 30
    const increment = difference / steps
    setIsBalanceChanging(true)
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setAnimatedBalance((prev) => {
        const newValue = prev + increment
        if (currentStep >= steps) {
          clearInterval(timer)
          setIsBalanceChanging(false)
          return balance
        }
        return Math.round(newValue)
      })
    }, 16)
    return () => clearInterval(timer)
  }, [balance])
  const handleCloseWithdrawalNotification = useCallback(() => {
    setShowWithdrawalNotification(false)
  }, [])
  // ── Restore localStorage state ───────────────────────────────────────────
  useEffect(() => {
    const savedClaimCount = localStorage.getItem('tivexx-claim-count')
    const savedPauseEndTime = localStorage.getItem('tivexx-pause-end-time')
    if (savedClaimCount) setClaimCount(Number.parseInt(savedClaimCount))
    if (savedPauseEndTime) {
      const pauseTime = Number.parseInt(savedPauseEndTime)
      if (pauseTime > Date.now()) {
        setPauseEndTime(pauseTime)
        setCanClaim(false)
      } else {
        localStorage.removeItem('tivexx-pause-end-time')
        localStorage.setItem('tivexx-claim-count', '0')
        setClaimCount(0)
      }
    }
    const savedTimer = localStorage.getItem('tivexx-timer')
    const savedTimestamp = localStorage.getItem('tivexx-timer-timestamp')
    if (savedTimer && savedTimestamp) {
      const elapsed = Math.floor(
        (Date.now() - Number.parseInt(savedTimestamp)) / 1000,
      )
      const remaining = Number.parseInt(savedTimer) - elapsed
      if (remaining > 0) {
        setTimeRemaining(remaining)
        setIsCounting(true)
        if (!pauseEndTime) setCanClaim(false)
      } else {
        setTimeRemaining(0)
        if (!pauseEndTime) setCanClaim(true)
        setIsCounting(false)
      }
    } else {
      setCanClaim(!pauseEndTime)
      setIsCounting(false)
    }
  }, [])
  // ── Pause countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!pauseEndTime) return
    const interval = setInterval(() => {
      const remaining = pauseEndTime - Date.now()
      if (remaining <= 0) {
        setPauseEndTime(null)
        setCanClaim(true)
        setClaimCount(0)
        localStorage.removeItem('tivexx-pause-end-time')
        localStorage.setItem('tivexx-claim-count', '0')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [pauseEndTime])
  // ── Claim timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCounting) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1
        localStorage.setItem('tivexx-timer', newTime.toString())
        localStorage.setItem('tivexx-timer-timestamp', Date.now().toString())
        if (newTime === 0) {
          setCanClaim(true)
          setIsCounting(false)
        }
        return newTime
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isCounting])
  // ── Handle claim ─────────────────────────────────────────────────────────
  const handleClaim = () => {
    if (pauseEndTime && pauseEndTime > Date.now()) {
      setShowPauseDialog(true)
      return
    }
    if (canClaim) {
      const newClaimCount = claimCount + 1
      const newBalance = balance + 1000
      setBalance(newBalance)
      setClaimCount(newClaimCount)
      localStorage.setItem('tivexx-claim-count', newClaimCount.toString())
      if (userData) {
        const updatedUser = {
          ...userData,
          balance: newBalance,
        }
        localStorage.setItem('tivexx-user', JSON.stringify(updatedUser))
        setUserData(updatedUser)
      }
      setShowClaimSuccess(true)
      setTimeout(() => setShowClaimSuccess(false), 3000)
      if (newClaimCount >= 50) {
        const fiveHoursLater = Date.now() + 5 * 60 * 60 * 1000
        setPauseEndTime(fiveHoursLater)
        localStorage.setItem('tivexx-pause-end-time', fiveHoursLater.toString())
        setCanClaim(false)
      } else {
        setCanClaim(false)
        setTimeRemaining(60)
        setIsCounting(true)
        localStorage.setItem('tivexx-timer', '60')
        localStorage.setItem('tivexx-timer-timestamp', Date.now().toString())
      }
      if (newClaimCount === 50) {
        setTimeout(() => setShowReminderDialog(true), 1000)
      }
      const txs = JSON.parse(
        localStorage.getItem('tivexx-transactions') || '[]',
      )
      txs.unshift({
        id: Date.now(),
        type: 'credit',
        description: 'Daily Claim Reward',
        amount: 1000,
        date: new Date().toISOString(),
      })
      localStorage.setItem('tivexx-transactions', JSON.stringify(txs))
    }
  }
  // ── Format helpers ───────────────────────────────────────────────────────
  const formatCurrency = (amount: number) => {
    if (!showBalance) {
      return (
        <span className="flex items-center gap-1.5">
          {[12, 8, 16].map((w, i) => (
            <span
              key={i}
              className="inline-block h-7 rounded-lg animate-pulse"
              style={{
                width: w * 4,
                background: 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </span>
      )
    }
    const formatted = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
    const [whole, decimal] = formatted.split('.')
    return (
      <span
        className={`font-mono transition-colors duration-300 ${isBalanceChanging ? 'text-emerald-300' : 'text-white'}`}
      >
        <span className="text-2xl align-top text-emerald-400 font-light">
          ₦
        </span>
        <span className="text-4xl font-black tracking-tight ml-1">{whole}</span>
        <span className="text-xl font-medium text-slate-300">.{decimal}</span>
      </span>
    )
  }
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  const formatPauseTime = () => {
    if (!pauseEndTime) return ''
    const remaining = Math.max(0, pauseEndTime - Date.now())
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }
  // ── Profile picture upload ───────────────────────────────────────────────
  const handleProfileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const updatedUser = userData
        ? {
            ...userData,
            profilePicture: result,
          }
        : {
            name: 'User',
            email: '',
            balance,
            userId: `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            hasMomoNumber: false,
            profilePicture: result,
          }
      setUserData(updatedUser)
      try {
        localStorage.setItem('tivexx-user', JSON.stringify(updatedUser))
      } catch (err) {
        console.error(err)
      }
    }
    reader.readAsDataURL(file)
  }
  // ── Menu items ───────────────────────────────────────────────────────────
  const menuItems: MenuItem[] = [
    {
      name: 'Loans',
      emoji: '💳',
      link: '/loan',
      color: 'text-purple-400',
      bgColor: '',
    },
    {
      name: 'Investments',
      emoji: '📈',
      link: '/investment',
      color: 'text-violet-400',
      bgColor: '',
    },
    {
      name: 'Daily Tasks',
      emoji: '🎁',
      link: '/task',
      color: 'text-yellow-400',
      bgColor: '',
    },
    {
      name: 'Helping Hands Channel',
      emoji: '📢',
      link: 'https://t.me/helpinghandsnews',
      external: true,
      color: 'text-blue-400',
      bgColor: '',
    },
  ]
  // ── Fetch user data ──────────────────────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem('tivexx-user')
    let user: UserData
    if (!storedUser) {
      user = {
        name: 'Demo User',
        email: 'demo@example.com',
        balance: 50000,
        userId: `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        hasMomoNumber: false,
      }
      localStorage.setItem('tivexx-user', JSON.stringify(user))
    } else {
      user = JSON.parse(storedUser)
    }
    const tutorialShown = localStorage.getItem('tivexx-tutorial-shown')
    if (!tutorialShown) setShowTutorial(true)
    if (typeof user.balance !== 'number') user.balance = 50000
    if (!user.userId)
      user.userId = `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const fetchUserBalance = async () => {
      try {
        const response = await fetch(
          `/api/user-balance?userId=${user.id || user.userId}&t=${Date.now()}`,
        )
        const data = await response.json()
        const localStorageBalance = user.balance || 50000
        const dbBalance = data.balance || 50000
        const baseBalance = Math.max(localStorageBalance, dbBalance)
        const referralEarnings = data.referral_balance || 0
        const lastSyncedReferrals =
          localStorage.getItem('tivexx-last-synced-referrals') || '0'
        const newReferralEarnings =
          referralEarnings - parseInt(lastSyncedReferrals)
        const totalBalance = baseBalance + Math.max(0, newReferralEarnings)
        setBalance(totalBalance)
        setAnimatedBalance(totalBalance)
        const updatedUser = {
          ...user,
          balance: totalBalance,
        }
        localStorage.setItem('tivexx-user', JSON.stringify(updatedUser))
        if (newReferralEarnings > 0)
          localStorage.setItem(
            'tivexx-last-synced-referrals',
            referralEarnings.toString(),
          )
        setUserData(updatedUser)
        await fetch(`/api/user-balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id || user.userId,
            balance: totalBalance,
          }),
        })
      } catch (error) {
        console.error('[Dashboard] Error fetching user balance:', error)
        setBalance(user.balance)
        setAnimatedBalance(user.balance)
        setUserData(user)
      }
    }
    fetchUserBalance()
    setTimeout(() => setShowWithdrawalNotification(true), 3000)
    const showRandomNotification = () => {
      const randomDelay =
        Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000
      setTimeout(() => {
        setShowWithdrawalNotification(true)
        showRandomNotification()
      }, randomDelay)
    }
    showRandomNotification()
  }, [])
  // ── Load transactions ────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('tivexx-transactions')
    if (stored) {
      try {
        setTransactions(JSON.parse(stored))
      } catch {
        setTransactions([])
      }
    }
  }, [])
  // ── Typewriter name ──────────────────────────────────────────────────────
  useEffect(() => {
    if (userData && nameIndex < userData.name.length) {
      const timeout = setTimeout(() => {
        setDisplayedName(userData.name.slice(0, nameIndex + 1))
        setNameIndex(nameIndex + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [userData, nameIndex])
  // ── Loading state ────────────────────────────────────────────────────────
  if (!userData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: '#0b0f1a',
        }}
      >
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-900" />
            <div className="absolute inset-0 rounded-full border-2 border-t-emerald-400 animate-spin" />
            <div className="absolute inset-2 rounded-full flex items-center justify-center text-xl">
              💚
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Loading your dashboard…
          </p>
        </div>
      </div>
    )
  }
  // ── Claim button label ───────────────────────────────────────────────────
  const claimLabel = pauseEndTime
    ? `Wait ${formatPauseTime()}`
    : canClaim
      ? 'Claim ₦1,000 Now'
      : `Next claim in ${formatTime(timeRemaining)}`
  const claimDisabled = !canClaim && !pauseEndTime
  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background:
          'linear-gradient(160deg, #0b0f1a 0%, #0d1a14 50%, #0b0f1a 100%)',
      }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-1 absolute top-[-10%] left-[-5%] w-72 h-72 rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)',
          }}
        />
        <div
          className="orb-2 absolute top-[30%] right-[-10%] w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(5,150,105,0.5) 0%, transparent 70%)',
          }}
        />
        <div
          className="orb-3 absolute bottom-[10%] left-[20%] w-64 h-64 rounded-full opacity-15"
          style={{
            background:
              'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Scrolling ticker */}
      <ScrollingText />

      {/* ── Pause Dialog ── */}
      <Modal open={showPauseDialog} onClose={() => setShowPauseDialog(false)}>
        <div
          className="glass-card p-6 space-y-4"
          style={{
            border: '1px solid rgba(234,179,8,0.2)',
            boxShadow: '0 0 40px rgba(0,0,0,0.6)',
          }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">⏰</div>
            <h3 className="text-lg font-bold text-white">Wait Required</h3>
            <p className="text-sm text-slate-400 mt-1">
              You must wait 5 hours before claiming again.
            </p>
          </div>
          <div
            className="text-center py-3 rounded-xl"
            style={{
              background: 'rgba(234,179,8,0.08)',
              border: '1px solid rgba(234,179,8,0.15)',
            }}
          >
            <p className="text-2xl font-black text-yellow-400 font-mono">
              {formatPauseTime()}
            </p>
            <p className="text-xs text-slate-500 mt-1">Remaining cooldown</p>
          </div>
          <p className="text-xs text-slate-400 text-center">
            In the meantime, you can earn by referring or taking loans.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowPauseDialog(false)
                window.location.href = '/refer'
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
              }}
            >
              Refer Friends
            </button>
            <button
              onClick={() => {
                setShowPauseDialog(false)
                window.location.href = '/loan'
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              }}
            >
              Take Loan
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Reminder Dialog ── */}
      <Modal
        open={showReminderDialog}
        onClose={() => setShowReminderDialog(false)}
      >
        <div
          className="glass-card p-6 space-y-4"
          style={{
            border: '1px solid rgba(37,99,235,0.2)',
            boxShadow: '0 0 40px rgba(0,0,0,0.6)',
          }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📢</div>
            <h3 className="text-lg font-bold text-white">Stay Updated!</h3>
            <p className="text-sm text-slate-400 mt-1">
              Join our channel for updates and tips for earning.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowReminderDialog(false)
                window.open('https://t.me/helpinghandsnews', '_self')
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              }}
            >
              Join Channel
            </button>
            <button
              onClick={() => {
                setShowReminderDialog(false)
                window.location.href = '/refer'
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
              }}
            >
              Refer More Friends
            </button>
          </div>
        </div>
      </Modal>

      {/* Tutorial */}
      {showTutorial && (
        <TutorialModal
          onClose={() => {
            setShowTutorial(false)
            localStorage.setItem('tivexx-tutorial-shown', 'true')
          }}
        />
      )}

      {/* Withdrawal notification */}
      {showWithdrawalNotification && (
        <WithdrawalNotification onClose={handleCloseWithdrawalNotification} />
      )}

      {/* ── Main Content ── */}
      <div className="max-w-md mx-auto px-4 pt-5 space-y-4 relative z-10">
        {/* ── Profile Card ── */}
        <div
          className="glass-card p-4 card-enter-1"
          style={{
            boxShadow:
              '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 0 16px rgba(16,185,129,0.4)',
              }}
            >
              {userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                  {userData?.name.charAt(0)}
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload profile picture"
              />
            </div>

            {/* Name & ID */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-semibold text-white truncate">
                  Hi, {displayedName}
                  {nameIndex < (userData?.name.length || 0) && (
                    <span className="cursor-blink text-emerald-400">|</span>
                  )}
                </span>
                <span>👋</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Welcome back!</p>
              <div
                className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg"
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.15)',
                }}
              >
                <ShieldIcon size={10} className="text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-mono font-medium">
                  {userData.userId}
                </span>
              </div>
            </div>

            {/* Notification bell */}
            <a
              href="https://t.me/helpinghandsnews"
              className="relative p-2 rounded-xl transition-all hover:bg-white/5 active:scale-95"
              style={{
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <BellIcon size={20} className="text-slate-400 bell-ring" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 dot-pulse" />
            </a>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 mt-4">
            <a href="/loan" className="flex-1">
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                }}
              >
                💳 Loan
              </button>
            </a>
            <a href="/withdraw" className="flex-1">
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                }}
              >
                💸 Withdraw
              </button>
            </a>
          </div>
        </div>

        {/* ── Balance Card ── */}
        <div
          className="rounded-2xl p-5 card-enter-2 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #064e3b 0%, #065f46 35%, #047857 65%, #166534 100%)',
            boxShadow:
              '0 8px 40px rgba(6,78,59,0.5), 0 0 0 1px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          </div>

          {/* Decorative circles */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
            style={{
              background:
                'radial-gradient(circle, rgba(52,211,153,0.6) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-15"
            style={{
              background:
                'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)',
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-300 dot-pulse" />
              <span className="text-xs font-medium text-emerald-200 uppercase tracking-wider">
                Available Balance
              </span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-emerald-200 transition-all hover:bg-white/10 active:scale-95"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {showBalance ? <EyeIcon size={13} /> : <EyeOffIcon size={13} />}
              <span>{showBalance ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          {/* Balance amount */}
          <div className="relative z-10 mb-5 min-h-[3rem] flex items-center">
            {formatCurrency(animatedBalance)}
            {isBalanceChanging && (
              <span className="ml-3 text-xs text-emerald-300 font-semibold animate-pulse">
                +₦1,000
              </span>
            )}
          </div>

          {/* Claim section */}
          <div
            className="relative z-10 rounded-xl p-4 space-y-3"
            style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Top bar */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
              style={{
                background: 'linear-gradient(90deg, #10b981, #34d399, #eab308)',
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    boxShadow: '0 0 12px rgba(16,185,129,0.4)',
                  }}
                >
                  <GiftIcon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Daily Reward
                  </p>
                  <p className="text-[11px] text-emerald-300">
                    Claim ₦1,000 every 60s
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-300 justify-end">
                  <ClockIcon size={12} />
                  <span className="text-sm font-bold font-mono">
                    {pauseEndTime
                      ? formatPauseTime()
                      : formatTime(timeRemaining)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {pauseEndTime ? 'Cooldown' : 'Time left'}
                </p>
              </div>
            </div>

            {/* Claim button */}
            <div className="relative">
              <button
                onClick={handleClaim}
                disabled={claimDisabled}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white relative overflow-hidden btn-shimmer transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                style={
                  claimDisabled
                    ? {
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }
                    : {
                        background:
                          'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                        boxShadow:
                          '0 0 24px rgba(16,185,129,0.5), 0 4px 16px rgba(0,0,0,0.3)',
                      }
                }
              >
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <GiftIcon size={18} />
                  {claimLabel}
                </span>
              </button>

              {/* Claim success notification */}
              {showClaimSuccess && (
                <div className="absolute -top-2 left-0 right-0 z-50 pointer-events-none">
                  <div className="relative max-w-xs mx-auto">
                    {/* Confetti */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 overflow-visible">
                      <div className="absolute w-2 h-2 bg-yellow-300 rounded-full top-0 left-1/4 confetti-1" />
                      <div className="absolute w-2 h-2 bg-pink-300 rounded-full top-0 left-1/2 confetti-2" />
                      <div className="absolute w-2 h-2 bg-blue-300 rounded-full top-0 left-3/4 confetti-3" />
                    </div>
                    <div
                      className="animate-slide-up-bounce rounded-2xl p-4 text-center"
                      style={{
                        background: 'linear-gradient(135deg, #065f46, #059669)',
                        border: '1px solid rgba(52,211,153,0.3)',
                        boxShadow:
                          '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.3)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-xl"
                        style={{
                          background:
                            'linear-gradient(135deg, #f59e0b, #ef4444)',
                        }}
                      >
                        🎉
                      </div>
                      <p className="text-sm font-bold text-white">Success!</p>
                      <p className="text-xl font-black text-yellow-300 my-1">
                        +₦1,000
                      </p>
                      <p className="text-[11px] text-emerald-200">
                        Balance updated
                      </p>
                      <div
                        className="mt-2 h-1 rounded-full overflow-hidden"
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                        }}
                      >
                        <div
                          className="h-full rounded-full progress-fill"
                          style={{
                            background: 'rgba(255,255,255,0.5)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Claims progress */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(claimCount / 50) * 100}%`,
                      background:
                        claimCount >= 50
                          ? '#f59e0b'
                          : 'linear-gradient(90deg, #10b981, #34d399)',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-300 font-mono shrink-0">
                  {claimCount}/50
                </span>
              </div>
              {claimCount >= 50 && (
                <span className="ml-2 text-xs text-yellow-400 font-semibold animate-pulse">
                  ⚠️ Limit
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div
            className="flex items-center gap-4 mt-4 pt-4 relative z-10"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex-1 text-center">
              <p className="text-[11px] text-emerald-300 uppercase tracking-wide">
                Daily Income
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                <TrendingUpIcon
                  size={12}
                  className="inline mr-1 text-emerald-400"
                />
                +₦{(claimCount * 1000).toLocaleString()}
              </p>
            </div>
            <div
              className="w-px h-8"
              style={{
                background: 'rgba(255,255,255,0.15)',
              }}
            />
            <div className="flex-1 text-center">
              <p className="text-[11px] text-emerald-300 uppercase tracking-wide">
                Claims Left
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                {Math.max(0, 50 - claimCount)} remaining
              </p>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div
          className="glass-card p-4 card-enter-3"
          style={{
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h4>
          <div className="space-y-1">
            {menuItems.map((item, idx) => {
              const content = (
                <div className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5 active:scale-[0.98] group">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span className="text-lg">{item.emoji}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                  <svg
                    className="ml-auto w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )
              return item.external ? (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <a key={idx} href={item.link || '#'} className="block">
                  {content}
                </a>
              )
            })}
          </div>
        </div>

        {/* ── Help & Support ── */}
        <div
          className="glass-card p-4 card-enter-4"
          style={{
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Help & Support</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 dot-pulse" />
                <p className="text-xs text-emerald-400">
                  24/7 support available
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://t.me/helpinghandsupport">
                <button
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                  }}
                >
                  <HeadphonesIcon size={18} className="text-white" />
                </button>
              </a>
              <a href="https://t.me/helpinghandsnews">
                <button
                  className="w-10 h-10 rounded-xl flex items-center justify-center relative transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                  }}
                >
                  <BellIcon size={18} className="text-white" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 dot-pulse" />
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* ── Referral Card ── */}
        <div className="card-enter-5">
          {userData && <ReferralCard userId={userData.id || userData.userId} />}
        </div>

        {/* ── Recent Activity ── */}
        <div
          className="glass-card p-4 card-enter-5"
          style={{
            borderLeft: '3px solid rgba(139,92,246,0.6)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <HistoryIcon size={16} className="text-purple-400" />
                <p className="text-sm font-semibold text-white">
                  Recent Activity
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest transactions
              </p>
            </div>
            <a
              href="/history"
              className="text-xs text-purple-400 font-semibold hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              See all
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>

          {transactions && transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.slice(0, 3).map((tx: any) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        tx.type === 'credit'
                          ? 'rgba(16,185,129,0.15)'
                          : 'rgba(239,68,68,0.15)',
                      border: `1px solid ${tx.type === 'credit' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    }}
                  >
                    <span className="text-base">
                      {tx.type === 'credit' ? '💰' : '💸'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {new Date(tx.date).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-bold shrink-0 ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {tx.amount
                      ? new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                        })
                          .format(tx.amount)
                          .replace('NGN', '₦')
                      : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm text-slate-500">No transactions yet</p>
              <p className="text-xs text-slate-600 mt-1">
                Your activity will appear here
              </p>
            </div>
          )}
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>

      {/* ── Bottom Navigation ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto"
        style={{
          background: 'rgba(11,15,26,0.85)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex justify-around items-center h-16 px-4">
          {[
            {
              href: '/dashboard',
              icon: <HomeIcon size={22} />,
              label: 'Home',
              active: true,
            },
            {
              href: '/abouttivexx',
              icon: <GamepadIcon size={22} />,
              label: 'About',
              active: false,
            },
            {
              href: '/refer',
              icon: <UserIcon size={22} />,
              label: 'Refer & Earn',
              active: false,
            },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${item.active ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.active && (
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
