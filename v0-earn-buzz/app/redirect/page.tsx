"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function RedirectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const to = searchParams.get("to") || ""
  const task = searchParams.get("task") || ""
  const [count, setCount] = useState(10)

  useEffect(() => {
    if (!to) return
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(t)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [to])

  const proceed = () => {
    if (!to) {
      // nothing to do
      return
    }
    try {
      localStorage.setItem("adClickStart", Date.now().toString())
      if (task) localStorage.setItem("adClickTaskId", task)
    } catch (e) {
      // ignore storage errors
    }
    // navigate to external link
    window.location.href = decodeURIComponent(to)
  }

  if (!to) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white/6 rounded-lg text-center">
          <h3 className="font-bold text-lg">No destination set</h3>
          <p className="text-sm text-white/80 mt-2">This redirect was opened without a target link.</p>
          <button className="mt-4 px-4 py-2 bg-emerald-600 rounded" onClick={() => router.back()}>Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white/6 rounded-lg text-center">
        <h3 className="font-bold text-lg">Preparing to open external site</h3>
        <p className="text-sm text-white/80 mt-2">You will be redirected shortly. Please stay on the opened site for at least 10 seconds to complete the task.</p>
        <div className="mt-4 text-2xl font-semibold">{count}s</div>
        <div className="mt-4 flex gap-3 justify-center">
          <button className="px-4 py-2 bg-emerald-600 rounded" onClick={proceed}>Proceed Now</button>
          <button className="px-4 py-2 bg-white/10 rounded" onClick={() => router.back()}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function RedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <RedirectContent />
    </Suspense>
  )
}
