import {
  startOfYear,
  startOfMonth,
  startOfDay,
  startOfHour,
  subYears,
  subMonths,
  subDays,
  subMinutes
} from 'date-fns'
import { RangeType } from 'lib/isomorphic/types'

export const getRangeStartTime = (
  rangeType: RangeType,
  absolute: boolean = false
) => {
  const now = new Date()
  let rangeStartTime: Date
  switch (rangeType) {
    case 'year': {
      rangeStartTime = absolute ? subYears(now, 1) : startOfYear(now)
      break
    }
    case 'month': {
      rangeStartTime = absolute ? subMonths(now, 1) : startOfMonth(now)
      break
    }
    case 'day': {
      rangeStartTime = absolute ? subDays(now, 1) : startOfDay(now)
      break
    }
    case 'hour': {
      rangeStartTime = absolute ? subMinutes(now, 1) : startOfHour(now)
      break
    }
  }
  return rangeStartTime
}

export const softMerge = (
  first: { [key: string]: any },
  second: { [key: string]: any }
) => {
  try {
    const merged = { ...first }

    for (const [ key, value ] of Object.entries(second)) {
      if (typeof merged[key] !== typeof value) {
        merged[key] = value
      } else if (typeof value === 'number') {
        merged[key] = merged[key] + value
      }
    }

    return merged
  } catch (error) {
    console.error(error)
    return { ...first, ...second }
  }
}
