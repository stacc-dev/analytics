import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { useRouter } from 'next/router'
import { Project } from 'lib/isomorphic/types'
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

  const project = useAuthedData<Project>(`/api/projects/get/${router.query.id}`, user)

  const [ showEditProjectDialog, setShowEditProjectDialog ] = useState(false)
  const [ editProjectName, setEditProjectName ] = useState('')
  const [ editProjectDomain, setEditProjectDomain ] = useState('')

  if (project.error) return project.error.message
  if (!project.data || !user) return 'Loading...'

  return (
    <main>
      <Title>Project: {project.data.name}</Title>
      
      <Modal title='Edit Project' visible={showEditProjectDialog} setVisible={setShowEditProjectDialog} controls={(
        <Box direction='row' staccSpace={16}>
          <Button variant='danger' color='secondary' onClick={async () => {
            await authedDataFetcher(`/api/projects/delete/${router.query.id}`, user)
            setShowEditProjectDialog(false)
            router.push('/projects')
          }}>
            Delete Project
          </Button>

          <Button variant='callout' color='accent' onClick={async () => {
            await authedDataFetcher(`/api/projects/edit/${router.query.id}`, user, { name: editProjectName, domain:  editProjectDomain })
            project.mutate({ ...project.data, name: editProjectName, domain: editProjectDomain })
            setShowEditProjectDialog(false)
          }} disabled={!project.data.name}>
            Save changes
          </Button>
        </Box>
      )}>

        <Input placeholder='BridgeHacks' label='Name' id='name' value={editProjectName} onChange={(event) => setEditProjectName(event.target.value)} />
        <Input placeholder='bridgehacks.com' label='Domain' id='domain'value={editProjectDomain} onChange={(event) => setEditProjectDomain(event.target.value)} />


      </Modal>

      <Button variant='callout' color='accent' onClick={() => {
        setEditProjectName(project.data.name)
        setEditProjectDomain(project.data.domain)
        setShowEditProjectDialog(true)
      }}>
        Edit
      </Button>
    </main>
  )
}