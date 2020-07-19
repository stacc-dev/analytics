import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { useRouter } from 'next/router'
import { Website, Hit } from 'lib/isomorphic/types'
import { useState } from 'react'
import { authedDataFetcher } from 'lib/client/helpers'
import { format, eachHourOfInterval, subDays } from 'date-fns'

import {
  FlexibleWidthXYPlot,
  DiscreteColorLegend,
  YAxis,
  XAxis,
  Crosshair,
  LineSeries
} from 'react-vis'

import Loader, { FullscreenLoader } from 'components/loader'
import Modal from 'components/modal'
import Button from 'components/button'
import Box from 'components/box'
import Input from 'components/input'
import Title from 'components/title'
import Text from 'components/text'
import Subsubtitle from 'components/subsubtitle'
import Subtitle from 'components/subtitle'
import Select from 'components/select'

const lastDayHours = eachHourOfInterval({
  start: subDays(new Date(), 1),
  end: new Date()
}).map((date) => date.getTime())

export default () => {
  const router = useRouter()

  const [ rangeType, setRangeType ] = useState('day')
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading)

  const website = useAuthedData<Website>(`/api/websites/get/${router.query.id}`, user)
  const hits = useAuthedData<{ hits: Hit[] }>(`/api/websites/aggregate/${router.query.id}?rangeType=${rangeType}`, user)

  const [ showEditWebsiteDialog, setShowEditWebsiteDialog ] = useState(false)
  const [ editWebsiteName, setEditWebsiteName ] = useState('')
  const [ editWebsiteDomain, setEditWebsiteDomain ] = useState('')

  if (website.error) return website.error.message
  if (!website.data || !user) return <FullscreenLoader />

  return <>
    <Box background='bg-primary' py={50} px={10} align='center'>
      <Box direction='column' maxWidth={900}>
        <Box staccSpace={12} direction='row' mobileProps={{ direction: 'column', justify: 'center', align: 'flex-start' }} justify='space-between' align='center'>
          <Title>{website.data.name}</Title>

          <Box direction='row' staccSpace={16}>
            <Button variant='peripheral' color='primary' onClick={() => {
              setEditWebsiteName(website.data.name)
              setEditWebsiteDomain(website.data.domain)
              setShowEditWebsiteDialog(true)
            }}>
              Edit
            </Button>
          </Box>
        </Box>
      </Box>

      <Box direction='column' staccSpace={38} maxWidth={1200}>
        {hits.error ? (
          <p>Error loading hits: {hits.error.message}</p>
        ) : !hits.data ? (
          <Loader text='Loading hits...' />
        ) : (
          <>
          <Box staccSpace={24}>
            <Box direction='row'>
            <Select options={['Yearly', 'Monthly', 'Daily']} values={['year', 'month', 'day']} selected={rangeType} onChange={(event) => {
              const { value } = event.target;
              setRangeType(value)
            }}/>
            </Box>
            <Box staccSpace={20} direction='row'>
              <Box $='article' staccSpace={8} background='accent' p={20} radius={8}>
                <Subsubtitle>Total views</Subsubtitle>
                {/* typescript doesn't like this but it works */}
                {/* @ts-ignore */}
                <Text>
                {hits.data.hits.reduce((past, current) => ({
                  ...past,
                  hits: past.hits + current.hits
                })).hits}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box>
          <Subtitle>Total Views Graph</Subtitle>
          <div className='plot'>
            <FlexibleWidthXYPlot height={330} margin={{ left: 100, right: 100 }} yPadding={10}>
              <YAxis />
              <XAxis tickTotal={8} tickFormat={(when) => format(new Date(when), `haaa`.toLowerCase())} />

              <LineSeries
                data={lastDayHours.map((hour) => {
                  const hit = hits.data.hits.find(({ rangeStartTime }) => rangeStartTime === hour)
                  if (!hit) return {
                    x: hour,
                    y: 0
                  }
                  return {
                    x: hit.rangeStartTime,
                    y: hit.hits
                  }
                })}

                style={{
                  fill: 'transparent',
                  strokeWidth: 2
                }}
              />
            </FlexibleWidthXYPlot>
          </div>
          </Box>
          </>
        )}
      </Box>
    </Box>
    
    <Modal title='Edit website' visible={showEditWebsiteDialog} setVisible={setShowEditWebsiteDialog} controls={(
      <Box direction='row' staccSpace={16}>
        <Button variant='danger' color='secondary' onClick={async () => {
          await authedDataFetcher(`/api/websites/delete/${router.query.id}`, user)
          setShowEditWebsiteDialog(false)
          router.push('/websites')
        }}>
          Delete
        </Button>

        <Button variant='callout' color='accent' onClick={async () => {
          await authedDataFetcher(`/api/websites/edit/${router.query.id}`, user, { name: editWebsiteName, domain:  editWebsiteDomain })
          website.mutate({ ...website.data, name: editWebsiteName, domain: editWebsiteDomain })
          setShowEditWebsiteDialog(false)
        }} disabled={!website.data.name}>
          Save changes
        </Button>
      </Box>
    )}>
      <Input placeholder='BridgeHacks' label='Name' id='name' value={editWebsiteName} onChange={(event) => setEditWebsiteName(event.target.value)} />
      <Input placeholder='bridgehacks.com' label='Domain' id='domain'value={editWebsiteDomain} onChange={(event) => setEditWebsiteDomain(event.target.value)} />
    </Modal>
  
    <style jsx>{`
      .plot {
        user-select: none;
      }
    `}</style>
  </>
}