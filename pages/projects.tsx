import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { authedDataFetcher, logout } from 'lib/client/helpers'
import { Project } from 'lib/isomorphic/types'
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
  const projects = useAuthedData<{ projects: (Project & { id: string })[] }>('/api/projects/list', user)
  const [ showNewProjectDialog, setShowNewProjectDialog ] = useState(false)

  const [ newProjectName, setNewProjectName ] = useState('')
  const [ newProjectDomain, setNewProjectDomain ] = useState('')

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

            {projects.data?.projects.length === 0 ? null : (
              <Button variant='peripheral' color='alternate' onClick={() => {
                setNewProjectName('')
                setShowNewProjectDialog(true)
              }}>
                New
              </Button>
            )}
          </Box>
        </Box>
        
        {projects.error ? (
          <p>Error loading projects: {projects.error.message}</p>
        ) : !projects.data ? (
          <Loader text='Loading projects...' />
        ) : projects.data.projects.length === 0 ? (
          <Box staccSpace={20}>
            <Text color='fg-muted'>
              Welcome, {user.displayName}! You don't have any websites with analytics setup... yet.{' '}
              It's as easy as one click to get started.
            </Text>

            <Box direction='row'>
              <Button variant='callout' color='accent' onClick={() => {
                setNewProjectName('')
                setShowNewProjectDialog(true)
              }}>
                New website
              </Button>
            </Box>
          </Box>
        ) : (
          <Waffle space={20} cellWidth={400}>
            {projects.data.projects.map((project) => (
              <Link href='/project/[id]' as={`/project/${project.id}`} key={project.id}>
                <a>
                  <Box $='article' staccSpace={8} background='bg-secondary' p={20} radius={12}>
                    <Subsubtitle>{project.name}</Subsubtitle>
                    <Text>{project.domain}</Text>
                    <Text>69,420 pageviews in the last day</Text>
                    {/* <a href={`/project/${project.id}`}>{project.name}</a> */}
                  </Box>
                </a>
              </Link>
            ))}
          </Waffle>
        )}
      </Box>
    </Box>


    <Modal title='New website' visible={showNewProjectDialog} setVisible={setShowNewProjectDialog} controls={(
      <Button variant='callout' color='alternate' onClick={async () => {
        const { id } = await authedDataFetcher('/api/projects/new', user, { name: newProjectName, domain: newProjectDomain })
        projects.revalidate()
        setShowNewProjectDialog(false)
        router.push('/project/[id]', `/project/${id}`)
      }} disabled={!newProjectName || !newProjectDomain}>
        Create
      </Button>
    )}>
      <Input placeholder='BridgeHacks' label='Name' id='name' value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)}/>
      <Input placeholder='bridgehacks.com' label='Domain' id='domain' value={newProjectDomain} onChange={(event) => setNewProjectDomain(event.target.value)} />
    </Modal>
  </>
}
