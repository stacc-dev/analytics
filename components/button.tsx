import { ReactNode } from 'react'

type VariantColor =
  | {
      variant: 'callout'
      color: 'accent' | 'alternate' | 'danger'
    }
  | {
      variant: 'peripheral' | 'danger'
      color: 'primary' | 'secondary' | 'alternate'
    }

type Props = VariantColor & {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
}

type SpecificStyles = {
  background: string
  foreground: string
  hoverBackground?: string
  hoverForeground?: string
  otherStyles?: string
}

const getSpecificStyles = (variant: string, color: string): SpecificStyles => {
  switch (variant) {
    case 'callout': {
      switch (color) {
        case 'accent': {
          return {
            background: 'accent',
            foreground: 'fg-normal',
            hoverBackground: 'accent-modifier-hover',
            otherStyles: 'box-shadow: 0px 4px 12px rgba(21, 75, 165, 0.2);'
          }
        }

        case 'alternate': {
          return {
            background: 'fg-normal',
            foreground: 'bg-primary',
            hoverForeground: 'accent',
            otherStyles: 'box-shadow: 0px 4px 12px rgba(21, 75, 165, 0.2);'
          }
        }

        case 'danger': {
          return {
            background: 'danger-darker',
            foreground: 'fg-normal',
            hoverBackground: 'danger-lighter',
            otherStyles: '0px 4px 12px rgba(165, 30, 21, 0.29);'
          }
        }
      }
    }

    case 'peripheral': {
      switch (color) {
        case 'primary':
        case 'secondary': {
          return {
            background: `bg-${color}`,
            foreground: 'fg-normal',
            hoverForeground: 'accent-modifier-fg-hover'
          }
        }

        case 'alternate': {
          return {
            background: 'fg-normal',
            foreground: 'bg-primary',
            hoverForeground: 'accent'
          }
        }
      }
    }

    case 'danger': {
      switch (color) {
        case 'primary':
        case 'secondary': {
          return {
            background: `bg-${color}`,
            foreground: 'danger-lighter'
          }
        }

        case 'alternate': {
          return {
            background: 'fg-normal',
            foreground: 'danger-darker'
          }
        }
      }
    }
  }
}

export default ({
  variant,
  color,
  children,
  onClick,
  disabled = false
}: Props) => {
  const specificStyles = getSpecificStyles(variant, color)

  return (
    <button onClick={onClick} disabled={disabled}>
      {children}

      <style jsx>{`
        button {
          background: var(--${specificStyles.background});
          color: var(--${specificStyles.foreground});
          border: none;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          padding: 16px 36px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 120ms ease;
          ${specificStyles.otherStyles ?? ''}
          display: block;
          user-select: none;
        }

        button:hover {
          background: var(
            --${specificStyles.hoverBackground ?? specificStyles.background}
          );
          color: var(
            --${specificStyles.hoverForeground ?? specificStyles.foreground}
          );
        }

        button[disabled] {
          background: var(--bg-secondary);
          color: var(--fg-silent);
          cursor: not-allowed;
          box-shadow: none;
        }

        button[disabled]:hover {
          background: var(--bg-secondary);
          color: var(--fg-silent);
        }
      `}</style>
    </button>
  )
}
