"use client"

import { useEffect } from "react"

/**
 * Drive --app-height from visualViewport so the first portrait paint matches
 * the post-rotate layout — BUT freeze that height while the virtual keyboard
 * is open. Updating --app-height to the shrunken visualViewport compresses
 * the equal panels and is what felt like the screen "distorting" on weight
 * entry.
 */
export function ViewportHeight() {
  useEffect(() => {
    const root = document.documentElement
    let baselineHeight = 0
    let baselineTop = 0
    let baselineOrientation =
      window.innerWidth > window.innerHeight ? "landscape" : "portrait"

    const orientation = () =>
      window.innerWidth > window.innerHeight ? "landscape" : "portrait"

    const focusedEditable = () => {
      const el = document.activeElement
      if (!(el instanceof HTMLElement)) return null
      const tag = el.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable) return el
      return null
    }

    const keyboardOpen = (visualHeight: number) => {
      if (!focusedEditable()) return false
      // Keyboard typically eats >20% of the screen; ignore tiny chrome jitter.
      if (baselineHeight > 0 && visualHeight < baselineHeight * 0.85) return true
      if (window.innerHeight - visualHeight > 120) return true
      return false
    }

    const clearShellLift = () => {
      const shell = document.querySelector<HTMLElement>(".phone-shell")
      if (shell) shell.style.transform = ""
    }

    /** Lift the fixed shell just enough so the focused field sits above the keyboard. */
    const liftFocusedField = () => {
      const shell = document.querySelector<HTMLElement>(".phone-shell")
      const el = focusedEditable()
      const vv = window.visualViewport
      if (!shell || !el || !vv || !keyboardOpen(Math.round(vv.height))) {
        clearShellLift()
        return
      }
      const visibleBottom = vv.offsetTop + vv.height
      const rect = el.getBoundingClientRect()
      const pad = 16
      const covered = rect.bottom - (visibleBottom - pad)
      if (covered > 0) {
        shell.style.transform = `translateY(-${Math.round(covered)}px)`
      } else {
        clearShellLift()
      }
    }

    const sync = () => {
      const vv = window.visualViewport
      const height = Math.round(vv?.height ?? window.innerHeight)
      const top = Math.round(vv?.offsetTop ?? 0)
      if (height <= 0) return

      const orient = orientation()
      const orientChanged = orient !== baselineOrientation

      if (orientChanged) {
        baselineOrientation = orient
        baselineHeight = height
        baselineTop = top
        clearShellLift()
      } else if (keyboardOpen(height)) {
        // Keep the last full-screen baseline — do not shrink the shell.
        liftFocusedField()
        return
      } else {
        // Chrome show/hide: allow height to grow; also accept modest shrinks
        // when nothing is focused (URL bar).
        if (height >= baselineHeight || baselineHeight === 0 || !focusedEditable()) {
          baselineHeight = height
          baselineTop = top
        }
        clearShellLift()
      }

      root.style.setProperty("--app-height", `${baselineHeight}px`)
      root.style.setProperty("--app-top", `${baselineTop}px`)
    }

    sync()
    const raf1 = window.requestAnimationFrame(() => {
      sync()
      window.requestAnimationFrame(sync)
    })
    const t1 = window.setTimeout(sync, 50)
    const t2 = window.setTimeout(sync, 250)
    const t3 = window.setTimeout(sync, 1000)

    const onFocusIn = () => {
      window.setTimeout(() => {
        sync()
        liftFocusedField()
      }, 50)
      window.setTimeout(liftFocusedField, 300)
    }
    const onFocusOut = () => {
      window.setTimeout(() => {
        clearShellLift()
        sync()
      }, 50)
    }

    window.addEventListener("resize", sync)
    window.addEventListener("orientationchange", sync)
    window.visualViewport?.addEventListener("resize", sync)
    window.visualViewport?.addEventListener("scroll", sync)
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)

    return () => {
      window.cancelAnimationFrame(raf1)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.removeEventListener("resize", sync)
      window.removeEventListener("orientationchange", sync)
      window.visualViewport?.removeEventListener("resize", sync)
      window.visualViewport?.removeEventListener("scroll", sync)
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
      clearShellLift()
    }
  }, [])

  return null
}
