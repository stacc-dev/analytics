import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { token } = req.query
  if (!token) return res.status(400).send('No token specified')

  res.setHeader('Content-Type', 'application/javascript')
  return res.status(200).send(`(async(token)=>{const res=await fetch('https://analytics.stacc.cc/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({referrer:document.referrer,token,href:location.href,language:navigator.language||navigator.userLanguage,os:navigator.platform})});if(!res.ok){throw new Error(await res.text())}const ws=new WebSocket('wss://aws.stacc.cc/client');ws.addEventListener('open',()=>{ws.send(JSON.stringify({type:'INIT',payload:{token}}));setInterval(()=>{ws.send(JSON.stringify({type:'PING'}))},15000)});ws.addEventListener('message',(event)=>{console.warn(event.data)})})('${token}');`)
}