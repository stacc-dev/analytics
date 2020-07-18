import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { authedDataFetcher, logout } from 'lib/client/helpers'
import { Website } from 'lib/isomorphic/types'
import Modal from 'components/modal'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Button from 'components/button'
import Box from 'components/box'
import Title from 'components/title'
import Text from 'components/text'
import Input from 'components/input'
import Waffle from 'components/waffle'
import Subsubtitle from 'components/subsubtitle'
import Loader, { FullscreenLoader } from 'components/loader'

export default () => {
  const router = useRouter()
  
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading)
  const websites = useAuthedData<{ websites: (Website & { id: string })[] }>('/api/websites/list', user)
  const [ showNewWebsiteDialog, setShowNewWebsiteDialog ] = useState(false)

  const [ newWebsiteName, setNewWebsiteName ] = useState('')
  const [ newWebsiteDomain, setNewWebsiteDomain ] = useState('')

  if (!user) return <FullscreenLoader />

  return <>
    <Box background='bg-primary' py={50} px={10} align='center'>
      <Box direction='column' staccSpace={38} maxWidth={900}>
        <Box staccSpace={12} direction='row' mobileProps={{ direction: 'column', justify: 'center', align: 'flex-start' }} justify='space-between' align='center'>
          <Title>Your websites</Title>

          <Box direction='row' staccSpace={16}>
            <Button variant='peripheral' color='primary' onClick={logout}>
              Logout
            </Button>

            {websites.data?.websites.length === 0 ? null : (
              <Button variant='peripheral' color='alternate' onClick={() => {
                setNewWebsiteName('')
                setShowNewWebsiteDialog(true)
              }}>
                New
              </Button>
            )}
          </Box>
        </Box>
        
        {websites.error ? (
          <p>Error loading websites: {websites.error.message}</p>
        ) : !websites.data ? (
          <Loader text='Loading websites...' />
        ) : websites.data.websites.length === 0 ? (
          <Box staccSpace={20}>
            <Text color='fg-muted'>
              Welcome, {user.displayName}! You don't have any websites with analytics setup... yet.{' '}
              It's as easy as one click to get started.
            </Text>

            <Box direction='row'>
              <Button variant='callout' color='accent' onClick={() => {
                setNewWebsiteName('')
                setShowNewWebsiteDialog(true)
              }}>
                New website
              </Button>
            </Box>
          </Box>
        ) : (
          <Waffle space={20} cellWidth={400}>
            {websites.data.websites.map((website) => (
              <Link href='/website/[id]' as={`/website/${website.id}`} key={website.id}>
                <a>
                  <Box $='article' staccSpace={8} background='bg-secondary' p={20} radius={12}>
                    <Subsubtitle>{website.name}</Subsubtitle>
                    <Text>{website.domain}</Text>
                    <Text>69,420 pageviews in the last day</Text>
                  </Box>
                </a>
              </Link>
            ))}
          </Waffle>
        )}
      </Box>
    </Box>


    <Modal title='New website' visible={showNewWebsiteDialog} setVisible={setShowNewWebsiteDialog} controls={(
      <Button variant='callout' color='alternate' onClick={async () => {
        const { id } = await authedDataFetcher('/api/websites/new', user, { name: newWebsiteName, domain: newWebsiteDomain })
        websites.revalidate()
        setShowNewWebsiteDialog(false)
        router.push('/website/[id]', `/website/${id}`)
      }} disabled={!newWebsiteName || !newWebsiteDomain}>
        Create
      </Button>
    )}>
      <Input placeholder='BridgeHacks' label='Name' id='name' value={newWebsiteName} onChange={(event) => setNewWebsiteName(event.target.value)}/>
      <Input placeholder='bridgehacks.com' label='Domain' id='domain' value={newWebsiteDomain} onChange={(event) => setNewWebsiteDomain(event.target.value)} />
    </Modal>
  </>
}
