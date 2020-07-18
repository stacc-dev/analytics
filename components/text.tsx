import { Color } from 'lib/isomorphic/types'
import { ReactNode } from 'react'

type Props = {
  $?: 'h2' | 'h3' | 'p' | 'span' | 'div' | 'section' | 'article',
  color?: Color,
  children: ReactNode
}

export default ({ $ = 'p', color = 'fg-muted', children }: Props) => (
  <$>
    {children}

    <style jsx>{`
      ${$} {
        color: var(--${color});
        margin: 0;
        font-weight: 400;
        font-size: 1rem;
        line-height: 1.4;
        user-select: none;
      }
    `}</style>
  </$>
)