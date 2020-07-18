import useSWR from 'swr'
import { User } from 'firebase'
import Router from 'next/router'
import { useEffect } from 'react'
import { authedDataFetcher } from 'lib/client/helpers'

export const useRequireUser = (user: User | null, loading: boolean, redirect: string = '/') => {
  useEffect(() => {
    if (!loading && !user) Router.replace(redirect)
  }, [ user, loading ])
}

export const useRequireNoUser = (user: User | null, loading: boolean, redirect: string = '/') => {
  useEffect(() => {
    if (!loading && user) Router.replace(redirect)
  }, [ user, loading ])
}

export const useAuthedData = <Type>(endpoint: string, user: User | null) => {
  return useSWR<Type>([ endpoint, user ], authedDataFetcher)
}