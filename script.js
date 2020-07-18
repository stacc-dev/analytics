(async () => {
  const res = await fetch('/api/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
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