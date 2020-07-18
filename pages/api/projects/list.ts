import { authenticate } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'

export default authenticate(async (req, res, user) => {
  const documents = await firebase
    .firestore()
    .collection('projects')
    .where('uid', '==', user.uid)
    .get()
  
  return res.status(200).json({
    projects: documents.docs.map((document) => ({
      ...document.data(),
      id: document.id
    }))
  })
})