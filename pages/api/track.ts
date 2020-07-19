import { NextApiRequest, NextApiResponse } from 'next'
import { normalizeDomain } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { getRangeStartTime } from 'lib/isomorphic/helpers'

const track = async (token: string, rangeType: string, os: string, language: string, path: string, referrer?: string) => {
  const rangeStartTime = getRangeStartTime(rangeType as 'year' | 'month' | 'day' | 'hour')

  await firebase.firestore()
    .collection('hits')
    .doc(token)
    .collection(rangeType + 's')
    .doc(rangeStartTime.getTime().toString())
    .set({
      token,
      rangeStartTime: rangeStartTime.getTime(),
      hits: firebase.firestore.FieldValue.increment(1),
      oses: {
        [os]: firebase.firestore.FieldValue.increment(1)
      },
      languages: {
        [language]: firebase.firestore.FieldValue.increment(1)
      },
      paths: {
        [path]: firebase.firestore.FieldValue.increment(1)
      },
      ...(referrer ? {
        referrers: {
          [referrer]: firebase.firestore.FieldValue.increment(1)
        }
      } : {})
    }, { merge: true })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
  res.setHeader('Vary', 'Access-Control-Request-Headers')
  if(req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
    res.status(200).end()
  } else {
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

    const promises = []
    for (let type of [ 'year', 'month', 'day', 'hour' ]) {
      promises.push(track(token, type, os, language, url.pathname, referrer))
    }
    await Promise.all(promises)

    return res.status(200).json({})
  }
}