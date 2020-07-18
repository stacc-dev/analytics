import getUid from 'uid-promise'
import { authenticate } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Project } from 'lib/isomorphic/types'

export default authenticate(async (req, res, user) => {
  const document = await firebase
    .firestore()
    .collection('projects')
    .doc(req.query.id as string)
    .get()

  if (!document.exists) return res.status(404).send('Project not found, dumbass')
  if (document.get('uid') !== user.uid) {
    return res.status(401).send('You aren\'t the owner, dumbass')
  }
  
  await document.ref.delete()
  return res.status(200).json({})
})