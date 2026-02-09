// app/refer/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Share2, Gift, Users, Wallet, Send, ChevronRight, Check, Sparkles, TrendingUp, Award } from 'lucide-react'
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
  const [origin, setOrigin] = useState('')
  const [activeMessage, setActiveMessage] = useState('')

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

  useEffect(() => {
    setOrigin(window.location.origin)
    
    // Set initial random message
    setActiveMessage(referralMessages[Math.floor(Math.random() * referralMessages.length)])

    const storedUser = localStorage.getItem('tivexx-user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    const user = JSON.parse(storedUser)
    const userId = user.id || user.userId

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

  const handleCopy = () => {
    if (!origin) return
    const msg = `${activeMessage}\n\nSign up here: ${origin}${referralLink}`
    navigator.clipboard.writeText(msg)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    if (!origin) return
    const msg = `${activeMessage}\n\nSign up here: ${origin}${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_self')
  }

  const shareTelegram = () => {
    if (!origin) return
    const link = `${origin}${referralLink}`
    const msg = `${activeMessage}\n\nSign up here: ${link}`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(msg)}`, '_self')
  }

  const cycleMessage = () => {
    const currentIndex = referralMessages.indexOf(activeMessage)
    const nextIndex = (currentIndex + 1) % referralMessages.length
    setActiveMessage(referralMessages[nextIndex])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-300 mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-black pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-green-800/95 to-green-900/90 backdrop-blur-lg border-b border-green-600/20 px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 mr-3">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Refer & Earn</h1>
              <p className="text-sm text-emerald-200/80 mt-1">Invite friends and earn rewards</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <span className="text-sm font-medium text-white">Earn ₦10,000</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/90 to-emerald-800/90 p-6 border border-emerald-500/30 shadow-xl">
          <div className="absolute top-4 right-4">
            <Gift className="h-12 w-12 text-emerald-200/40" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-emerald-500/20">
                <Award className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Your Referral Program</h2>
                <p className="text-emerald-100/80 text-sm">Share and earn with every friend</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div>
                <p className="text-emerald-100/70 text-sm">Earn per referral</p>
                <p className="text-3xl font-bold text-white mt-1">₦10,000</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-100/70 text-sm">Potential earnings</p>
                <p className="text-3xl font-bold text-amber-300 mt-1">
                  {userData ? formatCurrency(userData.referral_balance + (userData.pending_count || 0) * 10000) : '₦0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6">
        {/* Referral Link Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Referral Link</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={cycleMessage}
              className="text-emerald-200 hover:text-white hover:bg-white/5 text-sm"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Change message
            </Button>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-sm text-emerald-200/80 mb-3 font-medium">Share this message:</p>
            <div className="bg-black/30 rounded-lg p-3 mb-4">
              <p className="text-white text-sm leading-relaxed">{activeMessage}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/40 rounded-lg px-4 py-3 border border-white/10">
                <p className="text-xs text-emerald-200/60 mb-1">Your unique link</p>
                <p className="text-white font-medium truncate">
                  {origin ? `${origin}${referralLink}` : 'Loading...'}
                </p>
              </div>
              <Button 
                onClick={handleCopy} 
                variant={copied ? "default" : "outline"}
                size="icon" 
                disabled={!origin}
                className={`h-12 w-12 rounded-xl ${copied ? 'bg-emerald-600 text-white' : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'}`}
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Button 
            onClick={shareWhatsApp} 
            disabled={!origin}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-5 rounded-xl font-medium shadow-lg flex items-center justify-center gap-3 border border-green-500/30"
          >
            <Share2 className="h-5 w-5" />
            WhatsApp
          </Button>
          <Button 
            onClick={shareTelegram} 
            disabled={!origin}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-5 rounded-xl font-medium shadow-lg flex items-center justify-center gap-3 border border-emerald-500/30"
          >
            <Send className="h-5 w-5" />
            Telegram
          </Button>
        </div>

        {/* How It Works */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-emerald-400" />
            How It Works
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: Share2,
                title: "Share Your Link",
                description: "Share your unique referral link with friends",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                icon: Users,
                title: "They Sign Up",
                description: "Friends register using your referral code",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Wallet,
                title: "Earn Rewards",
                description: "Get ₦10,000 credited instantly per referral",
                color: "from-emerald-600 to-emerald-700"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-300/70">Step {index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-white mt-1">{step.title}</h4>
                  <p className="text-sm text-white/60 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 mb-6">
          <h3 className="text-lg font-semibold text-white mb-5 text-center">Your Referral Performance</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-4 text-center border border-emerald-500/20">
              <p className="text-3xl font-bold text-amber-300">{userData?.referral_count || 0}</p>
              <p className="text-sm text-emerald-200/80 mt-2">Successful Referrals</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-4 text-center border border-green-500/20">
              <p className="text-3xl font-bold text-emerald-300">
                {userData ? formatCurrency(userData.referral_balance) : '₦0'}
              </p>
              <p className="text-sm text-emerald-200/80 mt-2">Total Earned</p>
            </div>
          </div>

          {/* Pending Referrals */}
          <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/10 rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-200/80">Pending referrals</p>
                <p className="text-2xl font-bold text-amber-300 mt-1">{userData?.pending_count || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-amber-200/80">Potential earnings</p>
                <p className="text-xl font-bold text-amber-200 mt-1">
                  {userData ? formatCurrency((userData.pending_count || 0) * 10000) : '₦0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 rounded-xl p-5 border border-emerald-500/20 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Sparkles className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Pro Tip</h4>
              <p className="text-sm text-emerald-200/80">
                Share your link on social media and messaging platforms to maximize your earnings. 
                Each successful referral earns you ₦10,000 instantly!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6">
        <Button 
          onClick={shareWhatsApp}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-6 rounded-xl text-lg font-semibold shadow-xl flex items-center justify-center gap-3 border border-emerald-500/30"
        >
          <Share2 className="h-6 w-6" />
          Start Sharing Now
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'