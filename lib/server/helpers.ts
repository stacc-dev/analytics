import { NextApiRequest, NextApiResponse } from 'next'
import firebase from 'lib/server/firebase'

export const authenticate = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    user: firebase.auth.UserRecord
  ) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') return res.status(400).send('Unsupported method')

    const { idToken } = req.body
    if (typeof idToken !== 'string')
      return res.status(400).send('Invalid id token')

    let user: firebase.auth.UserRecord
    try {
      const claims = await firebase.auth().verifyIdToken(idToken, true)
      user = await firebase.auth().getUser(claims.uid)
    } catch (error) {
      return res.status(403).send(error.message)
    }

    await handler(req, res, user)
  }
}

export const validateDomain = (domain: string) => {
  if (domain.length === 0) return false
  if (domain.startsWith('.')) return false
  if (domain.endsWith('.')) return false
  if (domain.includes('..')) return false
  if (domain === 'localhost') return false
  return true
}

export const normalizeDomain = (domain: string) =>
  domain
    .replace(/^.*:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .replace(/\:[0-9]{1-5}$/, '')
