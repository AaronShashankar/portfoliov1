export function readPreference(key, allowed, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return allowed.includes(value) ? value : fallback
  } catch { return fallback }
}
export function savePreference(key, value) {
  try { window.localStorage.setItem(key, value) } catch { /* Storage may be unavailable in private browsing. */ }
}
