import { useEffect, useRef } from "react"

export function useTaskTimer() {
  const activeTaskTimers = useRef<Map<string, number>>(new Map()) // taskId -> startTime only

  const startTaskTimer = (taskId: string) => {
    // Record or overwrite the start time for this task
    activeTaskTimers.current.set(taskId, Date.now())
  }

  const clearTaskTimer = (taskId: string) => {
    activeTaskTimers.current.delete(taskId)
  }

  const attachFocusListener = (
    onTaskSuccess: (taskId: string, elapsed: number) => void,
    onTaskIncomplete: (taskId: string, elapsed: number) => void,
    isTaskCompleted: (taskId: string) => boolean
  ) => {
    const handleFocus = () => {
      const now = Date.now()
      const tasksToDelete: string[] = []

      for (const [taskId, startTime] of activeTaskTimers.current.entries()) {
        // Skip and delete if task is already completed (no retrigger)
        if (isTaskCompleted(taskId)) {
          tasksToDelete.push(taskId)
          continue
        }

        const elapsed = now - startTime

        if (elapsed >= 10000) {
          // Task completed — process and delete from tracking
          onTaskSuccess(taskId, elapsed)
          tasksToDelete.push(taskId)
        } else {
          // Task incomplete — show warning but keep in tracking for retry
          onTaskIncomplete(taskId, elapsed)
        }
      }

      // Clean up completed tasks after processing
      tasksToDelete.forEach((taskId) => activeTaskTimers.current.delete(taskId))
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }

  return { startTaskTimer, clearTaskTimer, attachFocusListener }
}
