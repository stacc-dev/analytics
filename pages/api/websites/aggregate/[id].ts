import { subDays, startOfHour } from 'date-fns'
import { authenticate } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Hit } from 'lib/isomorphic/types'

export default authenticate(async (req, res, user) => {
  const website = await firebase
    .firestore()
    .collection('websites')
    .doc(req.query.id as string)
    .get()
  if (!website.exists) return res.status(404).send('Website not found, dumbass')
  if (website.get('uid') !== user.uid) {
    return res.status(401).send('You aren\'t the owner, dumbass')
  }

  const query = await firebase
    .firestore()
    .collection('hits')
    .where('token', '==', website.get('token'))
    .where('date', '>=', subDays(new Date(), 1))
    .get()

  const aggregated = []
  const findItem = (searchTime: Date) => aggregated.find(({ time }) => time === startOfHour(searchTime).getTime())
  for (let doc of query.docs) {
    const hit = doc.data() as Hit
    const item = findItem(hit.date)

    if (!item) {
      aggregated.push({
        time: startOfHour(hit.date).getTime(),
        hits: 1
      })
    } else {
      item.hits++
    }
  }
  const hits = aggregated.sort(({ time: time1 }, { time: time2 }) => time1 < time2 ? 1 : -1)

  return res.status(200).json({ hits })
})