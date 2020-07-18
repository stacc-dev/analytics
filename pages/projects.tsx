import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { logout, authedDataFetcher } from 'lib/client/helpers'
import { Project } from 'lib/isomorphic/types'
import Modal from 'components/modal'
import { useState } from 'react'
import Link from 'next/link'

export default () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading)
  const projects = useAuthedData<{ projects: (Project & { id: string })[] }>('/api/projects/list', user)
  const [ showNewProjectDialog, setShowNewProjectDialog ] = useState(false)
  const [ newProjectName, setNewProjectName ] = useState('')

  if (!user) return 'Loading...'

  return <>
    <h1>Welcome, {user.displayName}!</h1>
    <button onClick={logout}>Logout</button>

    <Modal visible={showNewProjectDialog} setVisible={setShowNewProjectDialog}>
      <h2>New project</h2>
      <input placeholder='Project name' value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} />
      <button onClick={async () => {
        await authedDataFetcher('/api/projects/new', user, { name: newProjectName })
        projects.revalidate()
        setShowNewProjectDialog(false)
      }} disabled={!newProjectName}>
        Create
      </button>
    </Modal>

    {projects.error ? (
      <p>Error loading projects: {projects.error.message}</p>
    ) : !projects.data ? (
      <p>Loading projects...</p>
    ) : projects.data.projects.length === 0 ? (
      <p>
        Make a project you dumb fuck{' '}
        <button onClick={() => {
          setShowNewProjectDialog(true)
          setNewProjectName('')
        }}>
          Dumbass
        </button>
      </p>
    ) : (
      <ul>
        {projects.data.projects.map((project) => (
          <li key={project.id}>
            <Link href='/project/[id]' as={`/project/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    )}
  </>
}
