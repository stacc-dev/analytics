import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { useRouter } from 'next/router'
import { Website } from 'lib/isomorphic/types'
import { useState } from 'react'
import { authedDataFetcher } from 'lib/client/helpers'
import Modal from 'components/modal';
import Button from 'components/button'
import Box from 'components/box'
import Input from 'components/input'
import Title from 'components/title'

export default () => {
  const router = useRouter()

  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading)

  const website = useAuthedData<Website>(`/api/websites/get/${router.query.id}`, user)

  const [ showEditWebsiteDialog, setShowEditWebsiteDialog ] = useState(false)
  const [ editWebsiteName, setEditWebsiteName ] = useState('')
  const [ editWebsiteDomain, setEditWebsiteDomain ] = useState('')

  if (website.error) return website.error.message
  if (!website.data || !user) return 'Loading...'

  return (
    <main>
      <Title>Website: {website.data.name}</Title>
      
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

      <Button variant='callout' color='accent' onClick={() => {
        setEditWebsiteName(website.data.name)
        setEditWebsiteDomain(website.data.domain)
        setShowEditWebsiteDialog(true)
      }}>
        Edit
      </Button>
    </main>
  )
}