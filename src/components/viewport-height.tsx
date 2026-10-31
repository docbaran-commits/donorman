"use client"

import { useEffect } from "react"

/**
 * iOS Safari/PWA often resolves 100dvh / -webkit-fill-available wrong on the
 * first portrait paint; rotating to landscape and back recalculates and the
 * panels suddenly look right. Drive --app-height from visualViewport so the
 * first portrait frame matches that post-rotate layout.
 */
export function ViewportHeight() {
  useEffect(() => {
    const root = document.documentElement

    const sync = () => {
      const vv = window.visualViewport
      const height = Math.round(vv?.height ?? window.innerHeight)
      const top = Math.round(vv?.offsetTop ?? 0)
      if (height > 0) {
        root.style.setProperty("--app-height", `${height}px`)
      }
      root.style.setProperty("--app-top", `${top}px`)
    }

    sync()
    const raf1 = window.requestAnimationFrame(() => {
      sync()
      window.requestAnimationFrame(sync)
    })
    // Late passes catch iOS after chrome / safe-area settle (same moment a
    // rotate-back would have fixed the layout).
    const t1 = window.setTimeout(sync, 50)
    const t2 = window.setTimeout(sync, 250)
    const t3 = window.setTimeout(sync, 1000)

    window.addEventListener("resize", sync)
    window.addEventListener("orientationchange", sync)
    window.visualViewport?.addEventListener("resize", sync)
    window.visualViewport?.addEventListener("scroll", sync)

    return () => {
      window.cancelAnimationFrame(raf1)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.removeEventListener("resize", sync)
      window.removeEventListener("orientationchange", sync)
      window.visualViewport?.removeEventListener("resize", sync)
      window.visualViewport?.removeEventListener("scroll", sync)
    }
  }, [])

  return null
}
