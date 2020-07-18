import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser } from 'lib/client/hooks'

export default () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading)

  if (!user) return 'Loading...'
  return 'hey look a project owo'
}
