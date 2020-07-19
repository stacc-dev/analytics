import getUid from 'uid-promise'
import {
  authenticate,
  validateDomain,
  normalizeDomain
} from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Website } from 'lib/isomorphic/types'

export default authenticate(async (req, res, user) => {
  const { name, domain } = req.body
  if (!name) return res.status(400).send('No name specified')
  if (!domain) return res.status(400).send('No domain specified')

  const normalizedDomain = normalizeDomain(domain)
  if (!validateDomain(normalizedDomain))
    return res.status(400).send('Invalid domain')

  const website: Website = {
    uid: user.uid,
    token: await getUid(12),
    name,
    domain: normalizedDomain
  }

  const document = await firebase
    .firestore()
    .collection('websites')
    .add(website)

  return res.status(200).json({ id: document.id })
})
