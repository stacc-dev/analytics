export type Website = {
  uid: string
  name: string
  token: string
  domain: string
}
export type Color =
  | 'fg-normal'
  | 'fg-muted'
  | 'bg-primary'
  | 'bg-secondary'
  | 'accent'

export type PaddingProps = {
  p?: number
  px?: number
  py?: number
  pb?: number
  pt?: number
  pr?: number
  pl?: number
}

export type FlexProps = {
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
  align?: 'center' | 'flex-start' | 'flex-end'
  justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
  noFlex?: boolean
  expand?: number | boolean | string
}

export type Hit = {
  token: string
  rangeStartTime: number
  hits: number
  oses?: { [key: string]: number }
  languages?: { [key: string]: number }
  paths?: { [key: string]: number }
  referrers?: { [key: string]: number }
}

export type RangeType = 'year' | 'month' | 'day' | 'hour'
