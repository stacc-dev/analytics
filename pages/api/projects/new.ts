import getUid from 'uid-promise'
import { authenticate } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Project } from 'lib/isomorphic/types'

export default authenticate(async (req, res, user) => {
  const { name } = req.body
  if (!name) return res.status(400).send('No name specified')

  const project: Project = {
    uid: user.uid,
    token: await getUid(12),
    name
  }

  await firebase.firestore().collection('projects').add(project)
  
  return res.status(200).json({})
})