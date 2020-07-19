import { Color } from 'lib/isomorphic/types'
import { ReactNode } from 'react'

type Props = {
  $?: 'h1' | 'h2' | 'h3' | 'p'
  color?: Color
  children: ReactNode
}

export default ({ $ = 'h1', color = 'fg-normal', children }: Props) => (
  <$>
    {children}

    <style jsx>{`
      ${$} {
        color: var(--${color});
        margin: 0;
        font-weight: 600;
        font-size: 2rem;
        line-height: 1.2;
        user-select: none;
      }
    `}</style>
  </$>
)
