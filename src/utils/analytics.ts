const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

function safeGtag(...args: unknown[]) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag(...args)
}

export function pageview(page_path: string) {
  if (!GA_MEASUREMENT_ID) return
  safeGtag('config', GA_MEASUREMENT_ID, {
    page_path,
  })
}

export function event({
  action,
  category,
  label,
  value,
}: {
  action: string
  category?: string
  label?: string
  value?: string | number
}) {
  if (!GA_MEASUREMENT_ID) return
  safeGtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}
