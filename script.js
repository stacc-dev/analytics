(async () => {
  const res = fetch(`http://localhost:3000/api/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      referrer: document.referrer,
      token: '',
      href: location.href
    })
  })
  if (!res.ok) throw new Error(await res.text())
})()