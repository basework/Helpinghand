// app/refer/page.tsx
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
        let balance = 50000
        const stored = localStorage.getItem('tivexx-user')
        if (stored) {
          const u = JSON.parse(stored)
          const localBal = u.balance || 50000
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
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const shareTelegram = () => {
    if (!origin) return
    const link = `${origin}${referralLink}`
    const msg = `${getRandomMessage()}\n\nSign up here: ${link}`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black pb-20">
      {/* YOUR FULL JSX — SAME AS BEFORE */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white hover:bg-tiv-2/50 mr-2">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Refer & Earn</h1>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <Gift className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-2">Earn ₦10,000</h2>
          <p className="text-tiv-3">For every friend you refer!</p>
        </div>
      </div>

      <div className="px-6 mt-8">
        <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-green-700/30">
            <div className="w-10 h-10 rounded-full bg-tiv-3 flex items-center justify-center flex-shrink-0">
              <Share2 className="h-5 w-5 text-tiv-3" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Share Your Link</h4>
              <p className="text-sm text-gray-300">Share your unique referral link with friends and family</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-green-700/30">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-green-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">They Sign Up</h4>
              <p className="text-sm text-gray-300">Your friends register using your referral code</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-green-700/30">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0">
              <Wallet className="h-5 w-5 text-green-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Earn Rewards</h4>
              <p className="text-sm text-gray-300">Get ₦10,000 credited to your account instantly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-green-700/30">
          <p className="text-sm text-gray-300 mb-2">Your Referral Link</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={origin ? `${origin}${referralLink}` : 'Loading...'}
              readOnly
              className="flex-1 text-sm text-white bg-gray-800/50 rounded-lg px-3 py-2 border border-green-700/30"
            />
            <Button onClick={handleCopy} variant="outline" size="icon" disabled={!origin}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 flex flex-col gap-4">
        <Button onClick={shareWhatsApp} disabled={!origin} className="w-full bg-tiv-1 hover:bg-tiv-1 text-white py-6 rounded-xl text-lg font-semibold shadow-lg flex items-center justify-center gap-3">
          <Share2 className="h-5 w-5" /> Share on WhatsApp
        </Button>
        <Button onClick={shareTelegram} disabled={!origin} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl text-lg font-semibold shadow-lg flex items-center justify-center gap-3">
          <Send className="h-5 w-5" /> Share on Telegram
        </Button>
      </div>

      <div className="px-6 mt-8 mb-6">
        <div className="bg-gradient-to-br from-green-800/50 to-green-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-700/30">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Your Referral Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-green-700/30">
              <p className="text-3xl font-bold text-tiv-2">{userData?.referral_count || 0}</p>
              <p className="text-sm text-gray-300 mt-1">Total Referrals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-green-700/30">
              <p className="text-3xl font-bold text-green-400">
                {userData ? formatCurrency(userData.referral_balance) : '₦0'}
              </p>
              <p className="text-sm text-gray-300 mt-1">Total Earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// THIS IS THE ONLY EXPORT
export const dynamic = 'force-dynamic'