import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { useRouter } from 'next/router'
import { Website, Hit } from 'lib/isomorphic/types'
import { useState } from 'react'
import {
  authedDataFetcher,
  parseOses,
  parseLanguages
} from 'lib/client/helpers'
import {
  format,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachDayOfInterval,
  subDays,
  subYears,
  subMonths
} from 'date-fns'

import {
  FlexibleWidthXYPlot,
  YAxis,
  XAxis,
  LineSeries,
  RadialChart
} from 'react-vis'

import Loader, { FullscreenLoader } from 'components/loader'
import Modal from 'components/modal'
import Button from 'components/button'
import Box from 'components/box'
import Input from 'components/input'
import Title from 'components/title'
import Text from 'components/text'
import Subtitle from 'components/subtitle'
import Subsubtitle from 'components/subsubtitle'
import Select from 'components/select'

export default () => {
  const router = useRouter()

  const [rangeType, setRangeType] = useState('day')
  const [user, loading] = useAuthState(firebase.auth())
  useRequireUser(user, loading)

  const periodFunction =
    rangeType === 'year'
      ? eachMonthOfInterval
      : rangeType === 'month'
      ? eachDayOfInterval
      : eachHourOfInterval
  const subFunction =
    rangeType === 'year'
      ? subYears
      : rangeType === 'month'
      ? subMonths
      : subDays
  const periods = periodFunction({
    start: subFunction(new Date(), 1),
    end: new Date()
  }).map((date) => date.getTime())

  const website = useAuthedData<Website>(
    `/api/websites/get/${router.query.id}`,
    user
  )
  const hits = useAuthedData<{ hits: Hit[] }>(
    `/api/websites/aggregate/${router.query.id}?rangeType=${rangeType}`,
    user
  )

  const [showEditWebsiteDialog, setShowEditWebsiteDialog] = useState(false)
  const [editWebsiteName, setEditWebsiteName] = useState('')
  const [editWebsiteDomain, setEditWebsiteDomain] = useState('')

  if (website.error) return website.error.message
  if (!website.data || !user) return <FullscreenLoader />

  return (
    <>
      <Box
        background='bg-primary'
        staccSpace={52}
        py={50}
        px={10}
        align='center'
      >
        <Box direction='column' staccSpace={16} maxWidth={900}>
          <Box
            staccSpace={12}
            direction='row'
            mobileProps={{
              direction: 'column',
              justify: 'center',
              align: 'flex-start'
            }}
            justify='space-between'
            align='center'
          >
            <Title>{website.data.name}</Title>

            <Box direction='row' staccSpace={16}>
              <Button
                variant='peripheral'
                color='primary'
                onClick={() => {
                  setEditWebsiteName(website.data.name)
                  setEditWebsiteDomain(website.data.domain)
                  setShowEditWebsiteDialog(true)
                }}
              >
                Edit
              </Button>
            </Box>
          </Box>

          {hits.error ? (
            <p>Error loading hits: {hits.error.message}</p>
          ) : !hits.data ? (
            <Loader text='Loading analytics data...' />
          ) : hits.data.hits.length === 0 ? (
            <Box staccSpace={16} pt={100} align='center' textAlign='center'>
              <img src='/empty.svg' className='illustration' />
              <Subtitle>No data</Subtitle>
              <Text>
                Don't worry, you just haven't installed Stacc Analytics on your
                site yet!
              </Text>
              <Text>
                Just put this snippet of code in the head tag of your website:
              </Text>
              <code>
                {`<script src='https://analytics.stacc.cc/api/script/${website.data.token}'></script>`}
              </code>
            </Box>
          ) : (
            <Box direction='row'>
              <Select
                options={['Past year', 'Past month', 'Past day']}
                values={['year', 'month', 'day']}
                selected={rangeType}
                onChange={(event) => setRangeType(event.target.value)}
              />
            </Box>
          )}
        </Box>

        <Box direction='column' staccSpace={38} maxWidth={1400}>
          {hits.error ? (
            <p>Error loading hits: {hits.error.message}</p>
          ) : !hits.data || hits.data.hits.length === 0 ? null : (
            <Box>
              <Box
                direction='row'
                mobileProps={{ direction: 'column' }}
                pl={100}
              >
                <Box
                  $='article'
                  staccSpace={8}
                  background='accent'
                  p={20}
                  radius={8}
                >
                  <Subsubtitle>Total views</Subsubtitle>

                  <Text>
                    {
                      hits.data.hits.reduce(
                        (past, current) => ({
                          ...past,
                          hits: past.hits + current.hits
                        }),
                        { hits: 0 }
                      ).hits
                    }
                  </Text>
                </Box>
              </Box>

              <Box>
                <div className='plot'>
                  <FlexibleWidthXYPlot
                    height={330}
                    margin={{ left: 100, right: 100 }}
                    yPadding={10}
                  >
                    <YAxis />
                    <XAxis
                      tickTotal={8}
                      tickFormat={(when) => {
                        const date = new Date(when)
                        if (rangeType === 'year') {
                          return format(date, `MMM yyyy`)
                        } else if (rangeType === 'month') {
                          return format(date, `MMM do`)
                        } else {
                          return format(date, `haaa`)
                        }
                      }}
                    />

                    <LineSeries
                      data={periods.map((period) => {
                        const hit = hits.data.hits.find(
                          ({ rangeStartTime }) => rangeStartTime === period
                        )
                        if (!hit)
                          return {
                            x: period,
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

              <Box
                staccSpace={24}
                direction='row'
                pt={24}
                mobileProps={{
                  direction: 'column',
                  justify: 'center',
                  align: 'center'
                }}
                justify='space-evenly'
                align='center'
              >
                <Box staccSpace={24}>
                  <Subsubtitle>Operating Systems</Subsubtitle>
                  <div className='plot'>
                    <RadialChart
                      colorRange={[
                        'var(--accent)',
                        'var(--accent-lighter)',
                        'var(--accent-even-lighter)',
                        'var(--accent-darker)'
                      ]}
                      showLabels={true}
                      labelsStyle={{
                        fill: 'white',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        fontWeight: 600
                      }}
                      margin={{ left: 50, right: 50, top: 50, bottom: 50 }}
                      height={500}
                      width={400}
                      data={parseOses(
                        hits.data.hits.reduce(
                          (past, current) => {
                            return {
                              ...past,
                              oses: { ...past.oses, ...current.oses }
                            }
                          },
                          { oses: {} }
                        ).oses
                      )}
                    />
                  </div>
                </Box>

                <Box staccSpace={24}>
                  <Subsubtitle>Languages</Subsubtitle>
                  <div className='plot'>
                    <RadialChart
                      colorRange={[
                        'var(--accent)',
                        'var(--accent-lighter)',
                        'var(--accent-even-lighter)',
                        'var(--accent-darker)'
                      ]}
                      margin={{ left: 50, right: 50, top: 50, bottom: 50 }}
                      showLabels={true}
                      labelsStyle={{
                        fill: 'white',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        fontWeight: 600
                      }}
                      height={500}
                      width={400}
                      data={parseLanguages(
                        hits.data.hits.reduce(
                          (past, current) => {
                            return {
                              ...past,
                              languages: {
                                ...past.languages,
                                ...current.languages
                              }
                            }
                          },
                          { languages: {} }
                        ).languages
                      )}
                    />
                  </div>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Modal
        title='Edit website'
        visible={showEditWebsiteDialog}
        setVisible={setShowEditWebsiteDialog}
        controls={
          <Box direction='row' staccSpace={16}>
            <Button
              variant='danger'
              color='secondary'
              onClick={async () => {
                await authedDataFetcher(
                  `/api/websites/delete/${router.query.id}`,
                  user
                )
                setShowEditWebsiteDialog(false)
                router.push('/websites')
              }}
            >
              Delete
            </Button>

            <Button
              variant='callout'
              color='accent'
              onClick={async () => {
                await authedDataFetcher(
                  `/api/websites/edit/${router.query.id}`,
                  user,
                  { name: editWebsiteName, domain: editWebsiteDomain }
                )
                website.mutate({
                  ...website.data,
                  name: editWebsiteName,
                  domain: editWebsiteDomain
                })
                setShowEditWebsiteDialog(false)
              }}
              disabled={!website.data.name}
            >
              Save changes
            </Button>
          </Box>
        }
      >
        <Input
          placeholder='BridgeHacks'
          label='Name'
          id='name'
          value={editWebsiteName}
          onChange={(event) => setEditWebsiteName(event.target.value)}
        />
        <Input
          placeholder='bridgehacks.com'
          label='Domain'
          id='domain'
          value={editWebsiteDomain}
          onChange={(event) => setEditWebsiteDomain(event.target.value)}
        />
      </Modal>

      <style jsx>{`
        .plot {
          user-select: none;
        }

        .illustration {
          user-select: none;
          pointer-events: none;
          display: block;
          height: 200px;
        }
      `}</style>
    </>
  )
}
