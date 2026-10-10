/**
 * Smooth-scroll to a section by id once it exists in the DOM.
 *
 * Retries briefly because results are often rendered a moment after the
 * action that triggered the scroll (route change, Suspense, data fetch).
 * The fixed navbar offset comes from `scroll-padding-top` on <html>.
 * Pass `blur: true` after a search submit so the mobile keyboard closes
 * first — otherwise the viewport resize fights the scroll.
 */
export function scrollToSection(id: string, { delay = 120, blur = false }: { delay?: number; blur?: boolean } = {}) {
  if (typeof window === 'undefined') return
  if (blur && document.activeElement instanceof HTMLElement) document.activeElement.blur()

  let attempts = 0
  const run = () => {
    const el = document.getElementById(id)
    if (!el) {
      if (attempts++ < 20) setTimeout(run, 100)
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  setTimeout(run, delay)
}
