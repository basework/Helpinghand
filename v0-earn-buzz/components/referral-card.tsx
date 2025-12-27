"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Gift, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface ReferralCardProps {
  userId: string
}

interface UserData {
  referral_code: string
  referral_count: number
  referral_balance: number
}

export function ReferralCard({ userId }: ReferralCardProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUserData()
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchUserData, 5000)
    return () => clearInterval(interval)
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`)
      const data = await response.json()
      if (data.success) {
        setUserData(data.user)
      }
    } catch (error) {
      console.error("[v0] Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = () => {
    if (userData?.referral_code) {
      navigator.clipboard.writeText(userData.referral_code)
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      })
    }
  }

  const copyReferralLink = () => {
    if (userData?.referral_code && typeof window !== 'undefined') {
      const link = `${window.location.origin}/register?ref=${userData.referral_code}`
      navigator.clipboard.writeText(link)
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-tiv-3 rounded w-1/2"></div>
            <div className="h-12 bg-tiv-3 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#83456F] border-[#83456F] shadow-lg overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Gift className="h-5 w-5" />
            Referral Program
          </CardTitle>
          
          {/* Referral Count Badge - Horizontal to the title */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <Users className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Referrals</span>
            <div className="h-4 w-px bg-white/30 mx-1"></div>
            <span className="text-xl font-bold text-white">
              {userData?.referral_count || 0}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6 pt-2">
        {/* Stats Row */}
        <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {userData?.referral_count || 0}
            </div>
            <div className="text-sm text-white/70">Total Referrals</div>
          </div>
          
          <div className="h-12 w-px bg-white/20"></div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              ${userData?.referral_balance?.toFixed(2) || "0.00"}
            </div>
            <div className="text-sm text-white/70">Earned</div>
          </div>
          
          <div className="h-12 w-px bg-white/20"></div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">$10</div>
            <div className="text-sm text-white/70">Per Referral</div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-white/80">Your Referral Link</div>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 overflow-hidden">
              <div className="text-white font-mono text-sm truncate">
                {typeof window !== 'undefined' && userData?.referral_code 
                  ? `${window.location.origin}/register?ref=${userData.referral_code}`
                  : "Loading..."
                }
              </div>
            </div>
            <Button 
              onClick={copyReferralLink} 
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 rounded-lg transition-all shrink-0"
              size="lg"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
        
        {/* Quick Info */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-xs text-white/60 text-center">
            Share your link with friends. They get $10 credit, you get $10 when they sign up!
          </div>
        </div>
      </CardContent>
    </Card>
  )
}