import firebase from 'lib/client/firebase'
import { User } from 'firebase'
import { PaddingProps, FlexProps } from 'lib/isomorphic/types'

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

export const getFlexStyles = (props: FlexProps) => {
  const lines = []

  if (props.expand) {
    if (typeof props.expand === 'number' || typeof props.expand === 'string') {
      lines.push(`flex: ${props.expand};`)
    } else {
      lines.push('flex: 1;')
    }
  }

  if (!props.noFlex) {
    lines.push('display: flex;')

    if (props.align) lines.push(`align-items: ${props.align};`)
    if (props.justify) lines.push(`justify-content: ${props.justify};`)
    if (props.direction) lines.push(`flex-direction: ${props.direction};`)
  }

  return lines.join('\n')
}

export const getPaddingStyles = (props: PaddingProps) => {
  const lines = []

  if (props.p) lines.push(`padding: ${props.p}px;`)
  if (props.px) {
    lines.push(`padding-left: ${props.px}px;`)
    lines.push(`padding-right: ${props.px}px;`)
  }
  if (props.py) {
    lines.push(`padding-top: ${props.py}px;`)
    lines.push(`padding-bottom: ${props.py}px;`)
  }
  if (props.pt) lines.push(`padding-top: ${props.pt}px;`)
  if (props.pb) lines.push(`padding-bottom: ${props.pb}px;`)
  if (props.pl) lines.push(`padding-left: ${props.pl}px;`)
  if (props.pr) lines.push(`padding-right: ${props.pr}px;`)

  return lines.join('\n')
}