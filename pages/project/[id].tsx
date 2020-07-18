import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { useRouter } from 'next/router'
import { Project } from 'lib/isomorphic/types'

export default () => {
  const router = useRouter()
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading)
  const project = useAuthedData<Project>(`/api/projects/get/${router.query.id}`, user)
  if (!project.data || !user) return 'Loading...'
  if (project.error) return `Error loading project: ${project.error.message}`
  return (
    <main>
      <h1>Project: {project.data.name}</h1>
      <h2>Setup</h2>
      <p>To setup our analytics tracking, you need to load our client script. Here are some examples of how to do so</p>
    </main>
  )
}