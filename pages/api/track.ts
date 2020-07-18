import { authenticate, validateDomain, normalizeDomain } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Hit } from 'lib/isomorphic/types'

export default authenticate(async (req, res, user) => {
  const { href, referrer, token } = req.body
  if (!href) return res.status(400).send('No href specified')
  if (referrer == null || referrer == undefined) return res.status(400).send('No referrer specified')

  const url = new URL(href)
  if (!validateDomain(url.hostname)) return res.status(400).send('Invalid domain')

  const projects = await firebase.firestore().collection('projects').where('token', '==', token).get()
  if (projects.empty) return res.status(400).send('Project not found dumbass')
  const project = projects.docs[0]

  if (project.get('domain') !== normalizeDomain(url.hostname) && url.hostname !== 'localhost') {
    return res.status(400).send(`Invalid domain idiot, expected ${project.get('domain')}`)
  }
  
  const hit: Hit = {
    referrer,
    token,
    path: url.pathname
  }

  await firebase.firestore().collection('hits').add(hit)
  return res.status(200).json({})
})