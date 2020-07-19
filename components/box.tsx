import { ReactNode } from 'react'
import { Color, PaddingProps, FlexProps } from 'lib/isomorphic/types'
import { getFlexStyles, getPaddingStyles } from 'lib/client/helpers'

type Props = PaddingProps &
  FlexProps & {
    $?: 'div' | 'header' | 'footer' | 'nav' | 'section' | 'article' | 'a'
    background?: Color
    staccSpace?: number
    maxWidth?: number
    radius?: number
    mobileProps?: PaddingProps & FlexProps
    children: ReactNode
    textAlign?: 'left' | 'right' | 'center'
  }

export default ({
  $ = 'div',
  staccSpace,
  children,
  background,
  mobileProps,
  p,
  px,
  py,
  pl,
  pr,
  pt,
  pb,
  maxWidth,
  radius,
  direction = 'column',
  align,
  textAlign,
  expand,
  justify,
  noFlex
}: Props) => (
  <$>
    {children}

    <style jsx>{`
      ${$} {
        background: ${background ? `var(--${background})` : 'inherit'};
        ${maxWidth ? `max-width: ${maxWidth}px; width: 100%;` : ''}
        ${radius ? `border-radius: ${radius}px;` : ''}
        ${textAlign ? `text-align: ${textAlign};` : ''}
        ${getFlexStyles({ direction, align, expand, justify, noFlex })}
        ${getPaddingStyles({ p, px, py, pl, pr, pt, pb })}
      }

      ${$} :global(> *:not(:last-child)) {
        ${
          staccSpace
            ? `margin-${
                direction.startsWith('row') ? 'right' : 'bottom'
              }: ${staccSpace}px;`
            : ''
        }
      }

      @media only screen and (max-width: 800px) {
        ${$} {
          ${
            mobileProps
              ? `
                ${getFlexStyles(mobileProps)}
                ${getPaddingStyles(mobileProps)}
              `
              : ''
          }
        }

        ${$} :global(> *:not(:last-child)) {
          ${
            staccSpace
              ? `
                margin-${
                  (mobileProps?.direction ?? direction).startsWith('row')
                    ? 'right'
                    : 'bottom'
                }: ${staccSpace}px;
                margin-${
                  (mobileProps?.direction ?? direction).startsWith('row')
                    ? 'bottom'
                    : 'right'
                }: 0;
              `
              : ''
          }
        }
      }
    `}</style>
  </$>
)
