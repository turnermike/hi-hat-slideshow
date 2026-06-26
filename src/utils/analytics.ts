const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const GA_SCRIPT_ID = 'google-analytics-script'
let gtagInitialized = false

function initializeGtag() {
  if (typeof window === 'undefined') return
  if (!GA_MEASUREMENT_ID) {
    console.warn('[GA] VITE_GA_MEASUREMENT_ID is not set. Google Analytics will not initialize.')
    return
  }
  if (gtagInitialized) {
    console.log('[GA] initializeGtag skipped; already initialized.')
    return
  }

  console.log('[GA] initializeGtag starting with measurement ID:', GA_MEASUREMENT_ID)
  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: unknown[]) {
    window.dataLayer?.push(args)
  }

  const script = document.createElement('script')
  script.id = GA_SCRIPT_ID
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.async = true
  script.onload = () => console.log('[GA] gtag script loaded successfully.')
  script.onerror = () => console.warn('[GA] Failed to load gtag script from Google Analytics.')
  document.head.appendChild(script)

  window.gtag('js', new Date())
  gtagInitialized = true
}

export function pageview(page_path: string) {
  if (typeof window === 'undefined') return
  console.log('[GA] pageview called with path:', page_path)
  if (!GA_MEASUREMENT_ID) {
    console.warn('[GA] pageview skipped because VITE_GA_MEASUREMENT_ID is missing.')
    return
  }
  initializeGtag()
  if (typeof window.gtag !== 'function') {
    console.warn('[GA] pageview skipped because gtag is not initialized.')
    return
  }
  window.gtag('config', GA_MEASUREMENT_ID, {
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
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  initializeGtag()
  if (typeof window.gtag !== 'function') return
  window.gtag('event', action, {
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
