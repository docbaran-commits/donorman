"use client"

import { useEffect } from "react"

type EditingPanel = "recipient" | "donor" | null

/**
 * Drive --app-height from visualViewport for a correct first portrait paint.
 *
 * While typing in a number field, enter "focus mode":
 * - size the shell to the visible area above the keyboard
 * - show only the active panel (Recipient or Donor) so the field stays on screen
 * - hide the other panel + footer so digits are visible as they’re typed
 *
 * On blur, restore the equal dual-panel layout and the full-screen baseline.
 */
export function ViewportHeight() {
  useEffect(() => {
    const root = document.documentElement
    let baselineHeight = 0
    let baselineOrientation =
      window.innerWidth > window.innerHeight ? "landscape" : "portrait"
    let editing: EditingPanel = null
    let blurTimer = 0

    const orientation = () =>
      window.innerWidth > window.innerHeight ? "landscape" : "portrait"

    /** Snap to device pixels so fixed header text stays sharp on retina iOS. */
    const snapCssPx = (n: number) => {
      const dpr = window.devicePixelRatio || 1
      return Math.round(n * dpr) / dpr
    }

    const focusedEditable = () => {
      const el = document.activeElement
      if (!(el instanceof HTMLElement)) return null
      const tag = el.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable) return el
      return null
    }

    const panelFor = (el: HTMLElement | null): EditingPanel => {
      if (!el) return null
      const section = el.closest<HTMLElement>("main.panels > section[data-panel]")
      const id = section?.dataset.panel
      return id === "recipient" || id === "donor" ? id : null
    }

    const shell = () => document.querySelector<HTMLElement>(".phone-shell")

    const setEditing = (next: EditingPanel) => {
      editing = next
      const node = shell()
      if (!node) return
      if (next) node.setAttribute("data-editing", next)
      else node.removeAttribute("data-editing")
    }

    const applyShellFrame = (height: number) => {
      if (height > 0) {
        root.style.setProperty("--app-height", `${snapCssPx(height)}px`)
      }
      // Never drive --app-top from visualViewport.offsetTop — that reintroduces
      // the blurry DonorMan / PHM header on iOS.
      root.style.setProperty("--app-top", "0px")
    }

    const ensureFieldVisible = () => {
      const el = focusedEditable()
      if (!el) return
      // After focus-mode layout settles, scroll the field into the visible panel.
      window.requestAnimationFrame(() => {
        el.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" })
      })
    }

    const sync = () => {
      const vv = window.visualViewport
      // Prefer layout height when keyboard is closed; when open, vv.height is
      // the area above the keyboard. Ignore offsetTop for positioning.
      const height = Math.round(vv?.height ?? window.innerHeight)
      if (height <= 0) return

      const orient = orientation()
      if (orient !== baselineOrientation) {
        baselineOrientation = orient
        baselineHeight = height
        setEditing(null)
        applyShellFrame(baselineHeight)
        return
      }

      const el = focusedEditable()
      const panel = panelFor(el)
      const keyboardLikely =
        !!panel &&
        ((baselineHeight > 0 && height < baselineHeight * 0.9) ||
          window.innerHeight - height > 80)

      if (panel && (keyboardLikely || editing === panel)) {
        // Focus mode: shell = area above keyboard; only the active panel shows.
        setEditing(panel)
        applyShellFrame(height)
        ensureFieldVisible()
        return
      }

      // Full dual-panel layout.
      if (editing) setEditing(null)
      if (height >= baselineHeight || baselineHeight === 0 || !el) {
        baselineHeight = height
      }
      applyShellFrame(baselineHeight)
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
      window.clearTimeout(blurTimer)
      const panel = panelFor(focusedEditable())
      if (panel) setEditing(panel)
      // iOS keyboard animates in; sync a few times so the field tracks it.
      window.setTimeout(sync, 16)
      window.setTimeout(sync, 100)
      window.setTimeout(() => {
        sync()
        ensureFieldVisible()
      }, 320)
    }

    const onFocusOut = () => {
      // Wait a tick so focus moving between fields doesn't flicker.
      blurTimer = window.setTimeout(() => {
        if (!focusedEditable()) {
          setEditing(null)
          sync()
        }
      }, 80)
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
      window.clearTimeout(blurTimer)
      window.removeEventListener("resize", sync)
      window.removeEventListener("orientationchange", sync)
      window.visualViewport?.removeEventListener("resize", sync)
      window.visualViewport?.removeEventListener("scroll", sync)
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
      setEditing(null)
    }
  }, [])

  return null
}
