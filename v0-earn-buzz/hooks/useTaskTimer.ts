import { useEffect } from "react"

export function useTaskTimer() {
  // Store task tracking in sessionStorage: { taskId: startTime }
  const STORAGE_KEY = "taskTimers"

  const startTaskTimer = (taskId: string) => {
    try {
      const timers = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}")
      timers[taskId] = Date.now()
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(timers))
    } catch (e) {
      console.error("Error storing task timer:", e)
    }
  }

  const attachFocusListener = (
    onTaskSuccess: (taskId: string, elapsed: number) => void,
    onTaskIncomplete: (taskId: string, elapsed: number) => void,
    isTaskCompleted: (taskId: string) => boolean
  ) => {
    const handleFocus = () => {
      try {
        const timers = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}")
        if (!timers || Object.keys(timers).length === 0) return

        const now = Date.now()
        const tasksToDelete: string[] = []

        Object.entries(timers).forEach(([taskId, startTime]) => {
          const elapsed = now - (startTime as number)

          // Skip already-completed tasks
          if (isTaskCompleted(taskId)) {
            tasksToDelete.push(taskId)
            return
          }

          if (elapsed >= 10000) {
            // Task qualifies for completion
            onTaskSuccess(taskId, elapsed)
            tasksToDelete.push(taskId)
          } else {
            // Task incomplete — show warning, keep timestamp for retry
            onTaskIncomplete(taskId, elapsed)
          }
        })

        // Remove completed/processed tasks from storage
        tasksToDelete.forEach((taskId) => {
          delete timers[taskId]
        })

        if (Object.keys(timers).length > 0) {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(timers))
        } else {
          sessionStorage.removeItem(STORAGE_KEY)
        }
      } catch (e) {
        console.error("Error processing task timers on focus:", e)
      }
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }

  return { startTaskTimer, attachFocusListener }
}
