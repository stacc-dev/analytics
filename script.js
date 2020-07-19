;(async () => {
  const res = await fetch('https://analytics.stacc.cc/api/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      referrer: document.referrer,
      token: '',
      href: location.href,
      language: navigator.language || navigator.userLanguage,
      os: navigator.platform
    })
  })
  if (!res.ok) throw new Error(await res.text())
})()
