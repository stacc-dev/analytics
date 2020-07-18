import { Color } from 'lib/isomorphic/types'
import { ReactNode } from 'react'

type Props = {
  $?: 'h1' | 'h2' | 'h3' | 'p',
  color?: Color,
  children: ReactNode
}

export default ({ $ = 'h2', color = 'fg-normal', children }: Props) => (
  <$>
    {children}

    <style jsx>{`
      ${$} {
        color: var(--${color});
        margin: 0;
        font-weight: 600;
        font-size: 1.5rem;
        line-height: 1.3;
        user-select: none;
      }
    `}</style>
  </$>
)