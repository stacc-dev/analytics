export type Project = { uid: string, name: string, token: string, domain: string }
export type Hit = { referrer: string, token: string, path: string }
export type Color = 'fg-normal' | 'fg-muted' | 'bg-primary' | 'bg-secondary' | 'accent'

export type PaddingProps = {
  p?: number,
  px?: number,
  py?: number,
  pb?: number,
  pt?: number,
  pr?: number,
  pl?: number
}

export type FlexProps = {
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse',
  align?: 'center' | 'flex-start' | 'flex-end',
  justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between',
  noFlex?: boolean,
  expand?: number | boolean | string
}