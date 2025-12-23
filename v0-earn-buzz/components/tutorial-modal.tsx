"use client"

import { useState, useEffect } from "react"
import { Gift, Users, Wallet, TrendingUp, CheckCircle2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TutorialModalProps {
  onClose: () => void
}

export function TutorialModal({ onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [joinedChannel, setJoinedChannel] = useState(false)
  const [message, setMessage] = useState("")
  const [finished, setFinished] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const [showProceed, setShowProceed] = useState(true)

  // Persist joined state in localStorage
  useEffect(() => {
    const joined = localStorage.getItem("joined_community")
    if (joined === "true") {
      setJoinedChannel(true)
      setShowProceed(true)
    }
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [currentStep])

  const steps = [
    {
      icon: Gift,
      title: "Welcome to Helping Hands!",
      description:
        "Earn welcome bonus and daily cash by completing easy tasks. But first, join our Telegram channel for updates!",
      colorClass: "text-green-700",
      bgClass: "bg-tiv-4",
    },
    {
      icon: Users,
      title: "Refer & Earn",
      description:
        "Invite friends and earn bonuses for each successful referral. The more you refer, the more you earn!",
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
    {
      icon: TrendingUp,
      title: "Daily Earnings",
      description:
        "Claim rewards every 60 seconds. Tap the claim button and watch your wallet balance grow instantly.",
      colorClass: "text-lime-700",
      bgClass: "bg-lime-50",
    },
    {
      icon: Wallet,
      title: "Withdraw Anytime",
      description:
        "After completing tasks and reaching minimum earnings, withdrawals unlock instantly.",
      colorClass: "text-yellow-700",
      bgClass: "bg-yellow-50",
    },
  ]

  const current = steps[currentStep]
  const Icon = current.icon

  const handleNext = () => {
    if (currentStep === 0 && !joinedChannel) {
      setMessage("Please join the Telegram channel first before proceeding.")
      setShowProceed(false)
      return
    }

    setMessage("")
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setFinished(true)
      setTimeout(() => {
        try {
          onClose()
        } catch (e) {
          console.error("onClose error", e)
        }
      }, 2000)
    }
  }

  const handleJoinChannel = () => {
    window.open("https://t.me/Tivexx9jacommunity", "_blank")
    setJoinedChannel(true)
    setShowProceed(true)
    setMessage("")
    localStorage.setItem("joined_community", "true")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className={`${current.bgClass} p-6 flex items-center justify-center`}>
          <div className="p-3 rounded-full bg-white/0">
            <Icon className={`${current.colorClass} h-12 w-12`} />
          </div>
        </div>

        <div className="p-6 text-center" key={animKey}>
          {!finished ? (
            <>
              <h3 className="text-2xl font-semibold text-gray-900">{current.title}</h3>
              <p className="text-gray-600 text-sm mt-3">{current.description}</p>

              {/* Animated warning message */}
              {message && (
                <p className="text-red-500 text-sm mt-2 animate-slide-up-fade">{message}</p>
              )}

              {/* Step 1 logic */}
              {currentStep === 0 ? (
                <div className="mt-6 space-y-3">
                  {!joinedChannel && (
                    <Button
                      onClick={handleJoinChannel}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Join Telegram Channel</span>
                    </Button>
                  )}
                  {showProceed && (
                    <Button
                      onClick={handleNext}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Proceed
                    </Button>
                  )}
                </div>
              ) : (
                <div className="mt-6">
                  <Button
                    onClick={handleNext}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {currentStep === steps.length - 1 ? "Finish Tutorial" : "Next"}
                  </Button>
                </div>
              )}

              {/* Progress dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full ${
                      i === currentStep ? "bg-tiv-2 scale-110" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
              <h3 className="text-2xl font-bold mt-4 text-green-700">Congratulations!</h3>
              <p className="text-gray-600 mt-2">
                You’re all set to start earning with Helping Hands.
              </p>
              <div className="mt-5">
                <Button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  Proceed to Dashboard
                </Button>
              </div>
              <div aria-hidden className="mt-4 relative h-10">
                <span className="confetti conf-1">🎉</span>
                <span className="confetti conf-2">✨</span>
                <span className="confetti conf-3">🎈</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Styles for animation and confetti */}
      <style>{`
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-fade {
          animation: slideFadeIn 0.4s ease;
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.5s ease forwards;
        }

        .confetti {
          position: absolute;
          font-size: 18px;
          opacity: 0;
          transform: translateY(-6px) scale(0.9);
          animation: confettiPop 1.4s ease forwards;
        }
        .conf-1 { left: 20%; animation-delay: 0.1s; }
        .conf-2 { left: 50%; animation-delay: 0.25s; }
        .conf-3 { left: 75%; animation-delay: 0.4s; }

        @keyframes confettiPop {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          30% { opacity: 1; transform: translateY(-20px) scale(1.05); }
          70% { transform: translateY(-36px) scale(0.95); opacity: 0.9; }
          100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}