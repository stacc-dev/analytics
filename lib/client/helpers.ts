import firebase from 'lib/client/firebase'
import { User } from 'firebase'

export const loginWith = (provider: firebase.auth.AuthProvider) => async () => {
  const { user } = await firebase.auth().signInWithPopup(provider)
  return user
}

export const logout = () => firebase.auth().signOut()

export const authedDataFetcher = async (endpoint: string, user: User | null, payload?: {}) => {
  if (!user) return null
  const idToken = await user.getIdToken()

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...payload, idToken })
  })
  const text = await res.text()

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Error parsing JSON: ${text}`)
  }
}