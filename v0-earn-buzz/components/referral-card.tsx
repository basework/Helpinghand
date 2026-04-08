"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Gift, Check, Users, Sparkles, Link as LinkIcon } from "lucide-react"
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
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUserData()
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchUserData, 5000)
    return () => clearInterval(interval)
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/${userId}?t=${Date.now()}`, {
        cache: "no-store",
      })
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
      
      // Set copied state and show animation
      setIsCopied(true)
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
      
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="hh-card hh-loading-card">
        <div className="hh-loading-pulse">
          <div className="hh-pulse-line hh-pulse-line-1"></div>
          <div className="hh-pulse-line hh-pulse-line-2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="hh-card hh-referral-card hh-entry">
      {/* Card Header */}
      <div className="hh-card-header">
        <div className="hh-header-left">
          <div className="hh-icon-ring-small">
            <Gift className="h-4 w-4 text-amber-300" />
          </div>
          <span className="hh-header-title">Referral Program</span>
        </div>
        
        {/* Cool looking referral number badge */}
        <div className="hh-badge-large">
          <Users className="h-3 w-3 text-emerald-300" />
          <span className="hh-badge-text">{userData?.referral_count || 0}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="hh-card-content">
        {/* Stats Row */}
        <div className="hh-stats-row">
          <div className="hh-stat-item">
            <div className="hh-stat-label">Referrals</div>
            <div className="hh-stat-value text-amber-300">{userData?.referral_count || 0}</div>
          </div>
          <div className="hh-stat-divider"></div>
          <div className="hh-stat-item">
            <div className="hh-stat-label">Earnings</div>
            <div className="hh-stat-value text-emerald-300">
              ₦{(userData?.referral_balance || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Referral Code Display */}
        <div className="hh-code-container">
          <div className="hh-code-label">
            <LinkIcon className="h-3 w-3" />
            <span>Your referral code</span>
          </div>
          <div className="hh-code-value">{userData?.referral_code || 'N/A'}</div>
        </div>

        {/* Large Copy Button */}
        <button 
          onClick={copyReferralLink} 
          className={`hh-copy-button ${isCopied ? 'hh-copied' : ''}`}
          disabled={isCopied}
        >
          {isCopied ? (
            <>
              <span className="hh-button-shimmer"></span>
              <Check className="h-5 w-5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span className="hh-button-shimmer"></span>
              <Copy className="h-5 w-5" />
              <span>Copy Referral Link</span>
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            </>
          )}
        </button>

        {/* Success Message (appears when copied) */}
        {isCopied && (
          <div className="hh-success-message">
            <div className="hh-success-dot"></div>
            <span>Link copied to clipboard!</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .hh-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          width: 100%;
        }

        .hh-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(16,185,129,0.05);
        }

        .hh-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }

        .hh-referral-card {
          background: linear-gradient(135deg, rgba(131,69,111,0.3) 0%, rgba(5,13,20,0.9) 50%, rgba(16,185,129,0.1) 100%);
          border-color: rgba(131,69,111,0.3);
        }

        .hh-loading-card {
          padding: 20px;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hh-loading-pulse {
          width: 100%;
          space-y: 12px;
        }

        .hh-pulse-line {
          height: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .hh-pulse-line-1 {
          width: 60%;
          margin-bottom: 12px;
        }

        .hh-pulse-line-2 {
          width: 80%;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .hh-card-header {
          padding: 20px 20px 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hh-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hh-icon-ring-small {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(245,158,11,0.2));
          border: 1px solid rgba(245,158,11,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hh-header-title {
          font-size: 15px;
          font-weight: 600;
          color: white;
        }

        .hh-badge-large {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(16,185,129,0.3);
          border-radius: 30px;
          padding: 6px 14px;
        }

        .hh-badge-text {
          font-size: 16px;
          font-weight: 700;
          color: #fbbf24;
        }

        .hh-card-content {
          padding: 12px 20px 20px 20px;
        }

        .hh-stats-row {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 16px;
        }

        .hh-stat-item {
          flex: 1;
          text-align: center;
        }

        .hh-stat-divider {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.08);
        }

        .hh-stat-label {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 500;
        }

        .hh-stat-value {
          font-size: 18px;
          font-weight: 800;
          margin-top: 2px;
          font-family: 'JetBrains Mono', monospace;
        }

        .hh-code-container {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .hh-code-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #10b981;
          margin-bottom: 6px;
        }

        .hh-code-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 1px;
          background: rgba(255,255,255,0.03);
          padding: 8px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid rgba(16,185,129,0.2);
        }

        .hh-copy-button {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: white;
          box-shadow: 0 4px 20px rgba(124,58,237,0.3);
        }

        .hh-copy-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(124,58,237,0.5);
        }

        .hh-copy-button:active {
          transform: scale(0.98);
        }

        .hh-copied {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 4px 20px rgba(16,185,129,0.3);
          animation: copy-success 0.3s ease;
        }

        @keyframes copy-success {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        .hh-button-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2.5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        .hh-success-message {
          margin-top: 12px;
          padding: 10px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.3);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          animation: slide-up 0.3s ease;
        }

        .hh-success-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hh-entry {
          animation: entry 0.5s ease-out;
        }

        @keyframes entry {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hh-card:hover,
          .hh-copy-button:hover,
          .hh-pulse-line,
          .hh-button-shimmer,
          .hh-entry {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}