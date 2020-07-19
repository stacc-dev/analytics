import { subDays, startOfHour } from 'date-fns'
import { authenticate } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { getRangeStartTime, RangeType } from 'lib/isomorphic/helpers'
import { Hit } from 'lib/isomorphic/types'

const hierarchy = [ 'year', 'month', 'day', 'hour']
export default authenticate(async (req, res, user) => {
  const rangeType = (req.query.rangeType || 'day') as RangeType
  const website = await firebase
    .firestore()
    .collection('websites')
    .doc(req.query.id as string)
    .get()
  if (!website.exists) return res.status(404).send('Website not found, dumbass')
  // if (website.get('uid') !== user.uid) {
  //   return res.status(401).send('You aren\'t the owner, dumbass')
  // }

  const rangeStartTime = getRangeStartTime(rangeType)
  const collectionName = (hierarchy[hierarchy.indexOf(rangeType) + 1] || hierarchy[hierarchy.length - 1]) + 's'
  const query = await firebase
  .firestore()
  .collection('hits')
  .doc(website.get('token'))
  .collection(collectionName)
  .where('rangeStartTime', '>=', rangeStartTime.getTime())
  .get()
  
  const hits: Hit[] = query.docs.map((doc) => doc.data() as Hit)
  return res.status(200).json({ hits })
})