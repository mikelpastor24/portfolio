// Run before the page is displayed to prevent a flash of the wrong theme.
(() => {
  let preference = 'system'
  try {
    const saved = localStorage.getItem('portfolio.theme')
    if (saved === 'light' || saved === 'dark') preference = saved
  } catch { /* Follow the system theme when storage is unavailable. */ }

  const theme = preference === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : preference
  document.documentElement.dataset.themePreference = preference
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
})()
