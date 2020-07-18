import { useAuthState } from 'react-firebase-hooks/auth'
import firebase, { authProviders } from 'lib/client/firebase'
import { loginWith } from 'lib/client/helpers'
import { useRequireNoUser } from 'lib/client/hooks'

export default () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireNoUser(user, loading, '/projects')

  return <>
    <h1>Landing Page Dumbass</h1>
    <p>
      This is the landing page for this Next.js TypeScript SWR Water.css Serverless Firebase Auth template.{' '}
      Click the button below to get access to the protected page.
    </p>
    <button onClick={loginWith(authProviders.github)}>Login with GitHub</button>
  </>
}