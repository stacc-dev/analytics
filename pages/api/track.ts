import { NextApiRequest, NextApiResponse } from 'next'
import { validateDomain, normalizeDomain } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Hit } from 'lib/isomorphic/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'POST') return res.status(400).send('Unsupported method')

  const { href, referrer, token, os, language } = req.body
  if (!href) return res.status(400).send('No href specified')
  if (referrer == null || referrer == undefined) return res.status(400).send('No referrer specified')

  const url = new URL(href)
  
  const websites = await firebase.firestore().collection('websites').where('token', '==', token).get()
  if (websites.empty) return res.status(400).send('Website not found dumbass')
  const website = websites.docs[0]

  if (website.get('domain') !== normalizeDomain(url.hostname) && url.hostname !== 'localhost') {
    return res.status(400).send(`Wrong domain idiot, expected ${website.get('domain')}`)
  }
  
  const hit: Hit = {
    referrer,
    token,
    path: url.pathname,
    date: new Date(),
    language: language,
    os: os
  }

  await firebase.firestore().collection('hits').add(hit)
  return res.status(200).json({})
}