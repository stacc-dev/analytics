import { authenticate, validateDomain, normalizeDomain } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'

export default authenticate(async (req, res, user) => {
  const { name, domain } = req.body
  if (!name) return res.status(400).send('No name specified')
  if (!domain) return res.status(400).send('No domain specified')
  
  const normalizedDomain = normalizeDomain(domain)
  if (!validateDomain(normalizedDomain)) return res.status(400).send('Invalid domain')

  const document = await firebase
    .firestore()
    .collection('websites')
    .doc(req.query.id as string)
    .get()

  if (!document.exists) return res.status(404).send('Website not found, dumbass')
  // if (document.get('uid') !== user.uid) {
  //   return res.status(401).send('You aren\'t the owner, dumbass')
  // }
  
  await document.ref.update({ name, domain: normalizedDomain })
  return res.status(200).json({})
})