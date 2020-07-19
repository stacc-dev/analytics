import useSWR from 'swr'
import { User } from 'firebase'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { authedDataFetcher } from 'lib/client/helpers'

export const useRequireUser = (
  user: User | null,
  loading: boolean,
  redirect: string = '/'
) => {
  const router = useRouter()
  useEffect(() => {
    if (!loading && !user) router.replace(redirect)
  }, [user, loading])
}

export const useRequireNoUser = (
  user: User | null,
  loading: boolean,
  redirect: string = '/'
) => {
  const router = useRouter()
  useEffect(() => {
    if (!loading && user) router.replace(redirect)
  }, [user, loading])
}

export const useAuthedData = <Type>(endpoint: string, user: User | null) => {
  return useSWR<Type>([endpoint, user], authedDataFetcher)
}

export const useRealtimeUsers = (token: string | null, user: User | null) => {
  const [users, setUsers] = useState(0)

  useEffect(() => {
    if (!user || !token) return

    const ws = new WebSocket('wss://aws.stacc.cc/server')
    let timeout: NodeJS.Timeout

    ws.addEventListener('open', async () => {
      ws.send(
        JSON.stringify({
          type: 'INIT',
          payload: { token, idToken: await user.getIdToken() }
        })
      )

      timeout = setInterval(() => {
        ws.send(JSON.stringify({ type: 'PING' }))
      }, 15000)
    })

    ws.addEventListener('message', (event) => {
      const parsed = JSON.parse(event.data)
      if (parsed.type === 'MESSAGE') {
        console.warn(parsed.message)
      } else if (parsed.type === 'USERS') {
        setUsers(parsed.users)
      }
    })

    ws.addEventListener('close', () => clearTimeout(timeout))
  }, [token, user])

  return users
}
