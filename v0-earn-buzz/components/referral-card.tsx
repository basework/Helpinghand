"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Gift } from "lucide-react"
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
    <Card className="bg-[#83456F] border-[#83456F] shadow-lg">
      <CardHeader className="pb-3 flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-white">
          <Gift className="h-5 w-5" />
          Referral Count
        </CardTitle>
        <div className="text-2xl font-bold text-white">
          {userData?.referral_count || 0}
        </div>
      </CardHeader>
      <CardContent className="space-y-1 p-2">
        {/* Large box with copy button */}
        <div className="flex flex-col items-center justify-center min-h-[50px]">
          <Button 
            onClick={copyReferralLink} 
            className="bg-yellow-700 hover:bg-yellow-800 text-white font-semibold py-3 px-8 rounded-lg transition-all text-base"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Referral Link
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
