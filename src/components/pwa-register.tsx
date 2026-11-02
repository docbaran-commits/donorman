"use client"

import { useEffect } from "react"

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return

    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
    let registration: ServiceWorkerRegistration | null = null

    const askUpdate = () => {
      registration?.update().catch(() => {})
    }

    navigator.serviceWorker
      .register(`${base}/sw.js`, { scope: `${base}/`, updateViaCache: "none" })
      .then((reg) => {
        registration = reg
        askUpdate()
      })
      .catch(() => {
        // Calculator still works without offline caching.
      })

    // iOS home-screen PWAs often keep a sleeping SW; re-check when returning.
    const onVisible = () => {
      if (document.visibilityState === "visible") askUpdate()
    }
    window.addEventListener("focus", askUpdate)
    document.addEventListener("visibilitychange", onVisible)

    // When a new worker claims the page, reload once so shell HTML/JS refresh.
    const onControllerChange = () => {
      const key = "donorman-sw-reloaded"
      if (sessionStorage.getItem(key) === "1") return
      sessionStorage.setItem(key, "1")
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange)

    return () => {
      window.removeEventListener("focus", askUpdate)
      document.removeEventListener("visibilitychange", onVisible)
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      )
    }
  }, [])

  return null
}
