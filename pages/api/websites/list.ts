import { authenticate } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { getRangeStartTime } from 'lib/isomorphic/helpers'

export default authenticate(async (req, res, user) => {
  const documents = await firebase
    .firestore()
    .collection('websites')
    .where('uid', '==', user.uid)
    .get()

  return res.status(200).json({
    websites: await Promise.all(
      documents.docs.map(async (website) => {
        const rangeStartTime = getRangeStartTime('day', true)
        const collectionName = 'hours'

        const query = await firebase
          .firestore()
          .collection('hits')
          .doc(website.get('token'))
          .collection(collectionName)
          .where('rangeStartTime', '>=', rangeStartTime.getTime())
          .get()

        const totalHits = query.docs.reduce((acc, hit) => acc + hit.get('hits'), 0)
        
        return {
          ...website.data(),
          id: website.id,
          totalHits
        }
      })
    )
  })
})
