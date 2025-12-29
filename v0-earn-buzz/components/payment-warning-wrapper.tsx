"use client"

import { useEffect, useState, PropsWithChildren } from "react"
import { OpayWarningPopup } from "./opay-warning-popup"

export default function PaymentWarningWrapper({ children }: PropsWithChildren) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem("opay-warning-dismissed")
    if (!dismissed) {
      setShow(true)
      const t = window.setTimeout(() => {
        sessionStorage.setItem("opay-warning-dismissed", "1")
        setShow(false)
      }, 6000)
      return () => window.clearTimeout(t)
    }
  }, [])

  const handleClose = () => {
    sessionStorage.setItem("opay-warning-dismissed", "1")
    setShow(false)
  }

  return (
    <>
      {children}
      {show && <OpayWarningPopup onClose={handleClose} />}
    </>
  )
}
