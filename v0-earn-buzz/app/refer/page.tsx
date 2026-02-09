'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Share2, Gift, Users, Wallet, Send } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils/referral'

interface UserData {
  id: string
  referral_code: string
  referral_count: number
  referral_balance: number
  pending_count?: number
  balance?: number
}

export default function ReferPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [origin, setOrigin] = useState('') // ← WILL BE SET IN useEffect

  const referralMessages = [
    "Join Helping Hands now and start earning instantly! Complete simple tasks and get paid today!",
    "Ready to earn from home? Helping Hands pays you for simple tasks! Join now and watch your wallet grow!",
    "Don't miss out! Helping Hands gives you instant bonuses and daily earnings — sign up and start winning!",
    "Helping Hands lets you earn money daily — invite friends and claim free rewards!",
    "Turn your phone into an ATM! Join Helping Hands and get paid every day!",
    "Earn ₦10,000 per referral and get instant signup bonuses — Helping Hands is the real deal!",
    "Get rewarded for every invite! Join Helping Hands and earn without stress!",
    "Helping Hands pays you for completing simple tasks — join today and start earning!",
    "Make money online easily! Helping Hands gives you instant bonuses and daily claims!",
    "Earn fast, withdraw easily! Helping Hands is your ticket to daily income!",
    "Invite friends, earn ₦10,000 each! Start your earning journey with Helping Hands today!",
    "Need cash fast? Helping Hands gives you loans in just 5 minutes — no BVN required!",
    "Get instant loans without BVN! Helping Hands makes borrowing stress-free!",
    "Need urgent money? Helping Hands offers quick loans in minutes — sign up now!",
    "Take loans easily and start earning too! Helping Hands is your one-stop money app!",
  ]

  // ALL BROWSER LOGIC IN useEffect
  useEffect(() => {
    // Set origin
    setOrigin(window.location.origin)

    // Check auth
    const storedUser = localStorage.getItem('tivexx-user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    const user = JSON.parse(storedUser)
    const userId = user.id || user.userId

    // Fetch data
    fetch(`/api/referral-stats?userId=${userId}&t=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        let balance = 100000
        const stored = localStorage.getItem('tivexx-user')
        if (stored) {
          const u = JSON.parse(stored)
          const localBal = u.balance || 100000
          const refEarned = data.referral_balance || 0
          const lastSync = localStorage.getItem('tivexx-last-synced-referrals') || '0'
          const newEarned = Math.max(0, refEarned - parseInt(lastSync))
          balance = localBal + newEarned
          u.balance = balance
          localStorage.setItem('tivexx-user', JSON.stringify(u))
          if (newEarned > 0) {
            localStorage.setItem('tivexx-last-synced-referrals', refEarned.toString())
          }
        }

        setUserData({
          id: userId,
          referral_code: data.referral_code,
          referral_count: data.referral_count,
          referral_balance: data.referral_balance,
          pending_count: data.pending_count || 0,
          balance
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  const referralLink = userData?.referral_code
    ? `/register?ref=${userData.referral_code}`
    : '/register'

  const getRandomMessage = () => referralMessages[Math.floor(Math.random() * referralMessages.length)]

  const handleCopy = () => {
    if (!origin) return
    const msg = `${getRandomMessage()}\n\nSign up here: ${origin}${referralLink}`
    navigator.clipboard.writeText(msg)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    if (!origin) return
    const msg = `${getRandomMessage()}\n\nSign up here: ${origin}${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_self')
  }

  const shareTelegram = () => {
    if (!origin) return
    const link = `${origin}${referralLink}`
    const msg = `${getRandomMessage()}\n\nSign up here: ${link}`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(msg)}`, '_self')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-300 mx-auto"></div>
          <p className="mt-4 text-white text-sm font-medium tracking-wide">Loading referral data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black pb-24 animate-page-bounce">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white px-6 pt-8 pb-10 rounded-b-3xl shadow-2xl">
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 mr-3 transition-all duration-200">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Refer & Earn</h1>
        </div>
        
        <div className="bg-purple-900/10 backdrop-blur-xl rounded-2xl p-7 text-center border border-purple-700/30 shadow-lg animate-inner-bounce">
          <div className="mb-5">
            <div className="relative inline-flex">
              <Gift className="h-18 w-18 mx-auto text-purple-300/90 animate-inner-bounce-child delay-0" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-purple-100 tracking-tight animate-inner-bounce-child delay-1">
            Earn ₦10,000
          </h2>
          <p className="text-purple-200/90 text-base font-medium animate-inner-bounce-child delay-2">
            For every successful referral
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="px-6 mt-9">
        <div className="flex items-center mb-5">
          <div className="h-0.5 w-8 bg-emerald-400/50 rounded-full mr-3"></div>
          <h3 className="text-xl font-bold text-emerald-200 tracking-tight">How It Works</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-5 bg-white/8 backdrop-blur-xl p-5 rounded-xl border border-white/12 shadow-lg transition-transform hover:translate-y-[-2px]">
            <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white text-base mb-1.5 tracking-wide">Share Your Link</h4>
              <p className="text-sm text-white/85 leading-relaxed">Share your unique referral link with friends and family</p>
            </div>
          </div>
          
          <div className="flex items-start gap-5 bg-white/8 backdrop-blur-xl p-5 rounded-xl border border-white/12 shadow-lg transition-transform hover:translate-y-[-2px]">
            <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white text-base mb-1.5 tracking-wide">They Sign Up</h4>
              <p className="text-sm text-white/85 leading-relaxed">Your friends register using your referral code</p>
            </div>
          </div>
          
          <div className="flex items-start gap-5 bg-white/8 backdrop-blur-xl p-5 rounded-xl border border-white/12 shadow-lg transition-transform hover:translate-y-[-2px]">
            <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white text-base mb-1.5 tracking-wide">Earn Rewards</h4>
              <p className="text-sm text-white/85 leading-relaxed">Get ₦10,000 credited to your account instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Requirement Section */}
      <div className="px-6 mt-8">
        <div className="bg-blue-900/25 backdrop-blur-xl rounded-2xl p-6 border border-blue-700/40 shadow-lg animate-inner-bounce-child delay-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-blue-300 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-blue-200 tracking-tight">Important Requirement</h3>
          </div>
          <p className="text-sm text-blue-100/95 leading-relaxed mb-3">
            Your referred friends must complete <span className="font-bold text-blue-300">2 tasks</span> within Helping Hands before their referral is verified and you receive your ₦10,000 reward.
          </p>
          <p className="text-xs text-blue-200/75 font-medium tracking-wide">
            This ensures quality referrals and helps maintain platform integrity.
          </p>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="px-6 mt-8">
        <div className="bg-white/8 backdrop-blur-xl rounded-xl p-5 border border-white/12 shadow-lg animate-inner-bounce-child delay-3">
          <p className="text-sm text-white/90 font-medium mb-3 tracking-wide">Your Referral Link</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={origin ? `${origin}${referralLink}` : 'Loading...'}
                readOnly
                className="w-full text-sm text-white bg-white/12 rounded-lg px-4 py-3 border border-white/15 placeholder:text-white/60 font-medium tracking-wide shadow-inner"
              />
            </div>
            <Button 
              onClick={handleCopy} 
              variant="outline" 
              size="icon" 
              disabled={!origin} 
              className="border-white/15 text-white hover:bg-white/15 transition-all duration-200 h-11 w-11 shadow-md"
            >
              <Copy className="h-4.5 w-4.5" />
            </Button>
          </div>
          {copied && (
            <p className="text-xs text-emerald-300 font-medium mt-2 text-center animate-pulse">
              Copied to clipboard!
            </p>
          )}
        </div>
      </div>

      {/* Share Buttons */}
      <div className="px-6 mt-7 flex flex-col gap-4">
        <Button 
          onClick={shareWhatsApp} 
          disabled={!origin} 
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 rounded-xl text-base font-semibold shadow-xl flex items-center justify-center gap-3 border border-green-500/30 transition-all duration-200 hover:shadow-2xl animate-inner-bounce-child delay-2"
        >
          <Share2 className="h-5 w-5" /> 
          <span>Share on WhatsApp</span>
        </Button>
        
        <Button 
          onClick={shareTelegram} 
          disabled={!origin} 
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 rounded-xl text-base font-semibold shadow-xl flex items-center justify-center gap-3 border border-green-500/30 transition-all duration-200 hover:shadow-2xl animate-inner-bounce-child delay-3"
        >
          <Send className="h-5 w-5" /> 
          <span>Share on Telegram</span>
        </Button>
      </div>

      {/* Stats Section */}
      <div className="px-6 mt-8 mb-6">
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-7 border border-white/12 shadow-xl">
          <h3 className="text-lg font-bold text-emerald-200 mb-6 text-center tracking-tight">Your Referral Stats</h3>
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white/12 backdrop-blur-sm rounded-xl p-5 text-center border border-white/15 shadow-lg animate-inner-bounce-child delay-2 transition-transform hover:scale-[1.02]">
              <p className="text-3xl font-bold text-amber-300 tracking-tight">
                {userData?.referral_count || 0}
              </p>
              <p className="text-sm text-white/85 font-medium mt-2 tracking-wide">Total Referrals</p>
            </div>
            <div className="bg-white/12 backdrop-blur-sm rounded-xl p-5 text-center border border-white/15 shadow-lg animate-inner-bounce-child delay-3 transition-transform hover:scale-[1.02]">
              <p className="text-3xl font-bold text-emerald-300 tracking-tight">
                {userData ? formatCurrency(userData.referral_balance) : '₦0'}
              </p>
              <p className="text-sm text-white/85 font-medium mt-2 tracking-wide">Total Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Referrals */}
      <div className="px-6 mt-5 mb-10">
        <div className="text-center">
          <div className="inline-block bg-white/8 backdrop-blur-xl px-5 py-4 rounded-xl border border-white/15 shadow-lg">
            <div className="text-sm text-white/90 font-medium tracking-wide">Pending referrals</div>
            <div className="text-2xl font-bold text-amber-300 mt-2 tracking-tight">
              {userData?.pending_count || 0}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Page-wide gentle bounce */
        @keyframes gentleBouncePage { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-page-bounce { animation: gentleBouncePage 1.6s ease-in-out infinite; }

        /* Subtle inner bounce for the card and children */
        @keyframes gentleBounceInner { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-inner-bounce { animation: gentleBounceInner 1.8s ease-in-out infinite; }
        .animate-inner-bounce-child { animation: gentleBounceInner 1.8s ease-in-out infinite; }

        /* Staggered delays */
        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }
      `}</style>
    </div>
  )
}

// THIS IS THE ONLY EXPORT
export const dynamic = 'force-dynamic'