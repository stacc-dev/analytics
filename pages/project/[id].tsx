import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import Router from 'next/router'
import { Project } from 'lib/isomorphic/types'

export default () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading)
  const project = useAuthedData<Project>(`/api/projects/get/${Router.query.id}`, user)
  if (!project.data || !user) return 'Loading...'
  if (project.error) return `Error loading project: ${project.error.message}`
  return `hey look a project owo: ${project.data.name} ehehehe`
}
