import { ReactNode } from 'react'

type Props = {
  $?: 'div' | 'section' | 'article',
  space: number,
  cellWidth: number,
  children: ReactNode
}

export default ({ $ = 'div', space, cellWidth, children }: Props) => (
  <$>
    {children}

    <style jsx>{`
      ${$} {
        display: grid;
        gap: ${space}px;
        grid-template-columns: repeat(auto-fill, minmax(${cellWidth}px, 1fr));
      }
    `}</style>
  </$>
)