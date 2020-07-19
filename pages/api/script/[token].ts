import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { token } = req.query
  if (!token) return res.status(400).send('No token specified')

  res.setHeader('Content-Type', 'application/javascript')
  return res.status(200).send(`(async()=>{const res=await fetch('http://localhost:3000/api/track',{method:'POST',headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},body:JSON.stringify({referrer:document.referrer,token:'${token}',href:location.href,language:navigator.language||navigator.userLanguage,os:navigator.platform})});if(!res.ok){throw new Error(await res.text())}})();`)
}