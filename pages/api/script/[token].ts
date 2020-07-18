import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { token } = req.query
  if (!token) return res.status(400).send('No token specified')

  res.setHeader('Content-Type', 'application/javascript')
  return res.status(200).send(`(async()=>{let r=await fetch('https://analytics.stacc.cc/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({referrer:document.referrer,token:'${token}',href:location.href})});if(!r.ok)throw new Error(await r.text())})()`)
}