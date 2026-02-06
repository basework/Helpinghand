import { useEffect, useRef } from "react"

interface TaskTimerData {
  startTime: number
  notified: boolean
}

export function useTaskTimer() {
  const activeTaskTimers = useRef<Map<string, TaskTimerData>>(new Map())
  const focusListenerAttached = useRef(false)

  const startTaskTimer = (taskId: string) => {
    activeTaskTimers.current.set(taskId, { startTime: Date.now(), notified: false })
  }

  const clearTaskTimer = (taskId: string) => {
    activeTaskTimers.current.delete(taskId)
  }

  const attachFocusListener = (
    onTaskReturn: (taskId: string, elapsed: number) => void
  ) => {
    if (focusListenerAttached.current) return
    focusListenerAttached.current = true

    const handleFocus = () => {
      const now = Date.now()
      for (const [taskId, data] of activeTaskTimers.current.entries()) {
        if (data.notified) continue // Skip if we already notified for this return
        
        const elapsed = now - data.startTime
        data.notified = true // Mark as notified for this window return
        onTaskReturn(taskId, elapsed)
      }
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }

  return { startTaskTimer, clearTaskTimer, attachFocusListener }
}
