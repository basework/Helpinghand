"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function InvestmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-green-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Investment💰</h1>
        <p className="text-xl text-gray-600 mb-6">Coming Soon</p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3">
              ← Back to Dashboard
            </Button>
          </Link>

          <Link href="/refer">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3">
              Refer More Friends 🚀
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}