import firebase from 'lib/client/firebase'
import { User } from 'firebase'
import { PaddingProps, FlexProps } from 'lib/isomorphic/types'
import ISO6391 from 'iso-639-1'

export const loginWith = (provider: firebase.auth.AuthProvider) => async () => {
  const { user } = await firebase.auth().signInWithPopup(provider)
  return user
}

export const logout = () => firebase.auth().signOut()

export const authedDataFetcher = async (
  endpoint: string,
  user: User | null,
  payload?: {}
) => {
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

  if (typeof props.p === 'number') lines.push(`padding: ${props.p}px;`)
  if (typeof props.px === 'number') {
    lines.push(`padding-left: ${props.px}px;`)
    lines.push(`padding-right: ${props.px}px;`)
  }
  if (typeof props.py === 'number') {
    lines.push(`padding-top: ${props.py}px;`)
    lines.push(`padding-bottom: ${props.py}px;`)
  }
  if (typeof props.pt === 'number') lines.push(`padding-top: ${props.pt}px;`)
  if (typeof props.pb === 'number') lines.push(`padding-bottom: ${props.pb}px;`)
  if (typeof props.pl === 'number') lines.push(`padding-left: ${props.pl}px;`)
  if (typeof props.pr === 'number') lines.push(`padding-right: ${props.pr}px;`)

  return lines.join('\n')
}

export const parseOses = (oses: { [key: string]: number }) => {
  let supportedOses = {
    Windows: 0,
    macOS: 0,
    Linux: 0,
    Other: 0
  }

  for (let os of Object.entries(oses)) {
    if (os[0].toLowerCase().includes('windows')) {
      supportedOses.Windows += os[1]
    } else if (os[0].toLowerCase().includes('mac')) {
      supportedOses.macOS += os[1]
    } else if (os[0].toLowerCase().includes('linux')) {
      supportedOses.Linux += os[1]
    } else {
      supportedOses.Other += os[1]
    }
  }

  const entries = []
  for (let os of Object.entries(supportedOses)) {
    if (os[1] > 0) {
      entries.push({ angle: os[1], label: os[0] })
    }
  }
  return entries
}

export const parseLanguages = (languages: { [key: string]: number }) => {
  let langs = {}
  for (let language of Object.entries(languages)) {
    const name = ISO6391.getName(language[0].substr(0, 2))
    if (!langs[name]) {
      langs[name] = language[1]
    } else {
      langs[name] += language[1]
    }
  }

  let data = []
  for (let lang of Object.entries(langs)) {
    data.push({ angle: lang[1], label: lang[0] })
  }
  return data
}
