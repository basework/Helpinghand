"use client"

import React, { useEffect, useRef, useState } from "react"
import { AlertTriangle, X } from "lucide-react"

interface OpayWarningPopupProps {
  /** Number of seconds between each popup show cycle */
  intervalSeconds?: number
}

export function OpayWarningPopup({
  intervalSeconds = 10,
}: OpayWarningPopupProps) {
  const [visible, setVisible] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Hide popup after 4 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, 4000)

    timeoutRef.current = hideTimer

    // Show popup again after interval
    const showTimer = setTimeout(() => {
      setVisible(true)
      // Restart the cycle
      const newHideTimer = setTimeout(() => {
        setVisible(false)
      }, 4000)
      timeoutRef.current = newHideTimer
    }, intervalSeconds * 1000)

    return () => {
      if (hideTimer) clearTimeout(hideTimer)
      if (showTimer) clearTimeout(showTimer)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [intervalSeconds])

  if (!visible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 p-4">
      <div className="mx-auto max-w-xs w-full pointer-events-auto">
        <div
          role="dialog"
          aria-labelledby="opay-warning-title"
          className="relative bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl overflow-hidden p-3 flex items-start gap-3 transform -translate-y-6 animate-opay-drop"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <div className="flex-1">
            <h3 id="opay-warning-title" className="text-sm font-semibold text-gray-900">Payment Notice</h3>
            <p className="mt-1 text-xs text-gray-600 leading-snug">
              Do not use <strong>Opay or Palmpay</strong> for transfers — Other banks are allowed.
              <strong>And refrain from disputing your transaction with your bank; it will complicate things further.</strong>
            </p>
          </div>

          <button
            onClick={() => setVisible(false)}
            aria-label="Close"
            className="ml-3 text-gray-500 hover:text-gray-700 p-1 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes opayDrop {
          0% { opacity: 0; transform: translateY(-20px) scale(.98); }
          60% { opacity: 1; transform: translateY(6px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-opay-drop {
          animation: opayDrop 700ms cubic-bezier(.2,.9,.3,1) both;
        }
      `}</style>
    </div>
  )
}
