import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { useRouter } from 'next/router'
import { Project } from 'lib/isomorphic/types'
import Modal from 'components/modal';
import { useState } from 'react'
import { authedDataFetcher } from 'lib/client/helpers'


export default () => {
  const [ showEditProjectDialog, setShowEditProjectDialog ] = useState(false)

  const router = useRouter()
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading)
  const project = useAuthedData<Project>(`/api/projects/get/${router.query.id}`, user)
  if (!project?.data || !user) return 'Loading...'
  if (project?.error) return `Error loading project: ${project.error.message}`
  const [projectData, setProjectData] = useState(project.data)
  return (
    <main>
      <h1>Project: {project.data.name}</h1>
      <Modal visible={showEditProjectDialog} setVisible={setShowEditProjectDialog}>
      <h2>Edit project</h2>
      <input placeholder='Project name' value={projectData?.name} onChange={event => {
        const { value } = event.target
        setProjectData({
          uid: projectData.uid,
          token: projectData.token,
          id: project.id,
          domain: projectData.domain,
          name: value, 
        })
      }}/>
      <button onClick={async () => {
        await authedDataFetcher(`/api/projects/edit/${projectData.id}`, user, { name: projectData.name })
        project.revalidate()
        setShowEditProjectDialog(false)
      }} disabled={!projectData?.name}>
        Save changes
      </button>
      <button onClick={async () => {
        await authedDataFetcher(`/api/projects/delete/${project.id}`, user)
        project.revalidate()
        setShowEditProjectDialog(false)
        setProject(null)
      }}>
        Delete Project
      </button>
    </Modal>
      <h2>Setup</h2>
      <p>To setup our analytics tracking, you need to load our client script. Here are some examples of how to do so</p>
    </main>
  )
}