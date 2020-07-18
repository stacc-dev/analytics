import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { useRouter } from 'next/router'
import { Project } from 'lib/isomorphic/types'
import Modal from 'components/modal';
import { useState } from 'react'
import { authedDataFetcher } from 'lib/client/helpers'

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
      <h1>Project: {project.data.name}</h1>
      
      <Modal visible={showEditProjectDialog} setVisible={setShowEditProjectDialog}>
        <h2>Edit project</h2>

        <input placeholder='Name' value={editProjectName} onChange={(event) => setEditProjectName(event.target.value)} />
        <input placeholder='Domain' value={editProjectDomain} onChange={(event) => setEditProjectDomain(event.target.value)} />

        <button onClick={async () => {
          await authedDataFetcher(`/api/projects/edit/${router.query.id}`, user, { name: editProjectName, domain: editProjectDomain })
          project.mutate({ ...project.data, name: editProjectName, domain: editProjectDomain })
          setShowEditProjectDialog(false)
        }} disabled={!project.data.name}>
          Save changes
        </button>

        <button onClick={async () => {
          await authedDataFetcher(`/api/projects/delete/${router.query.id}`, user)
          setShowEditProjectDialog(false)
          router.push('/projects')
        }}>
          Delete Project
        </button>
      </Modal>

      <button onClick={() => {
        setEditProjectName(project.data.name)
        setEditProjectDomain(project.data.domain)
        setShowEditProjectDialog(true)
      }}>
        Edit
      </button>
    </main>
  )
}