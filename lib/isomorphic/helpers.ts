import { startOfYear, startOfMonth, startOfDay, startOfHour } from 'date-fns'

export const getRangeStartTime = (rangeType: 'year' | 'month' | 'day' | 'hour') => {
  const now = new Date()
  let rangeStartTime: Date
  switch (rangeType) {
    case 'year': {
      rangeStartTime = startOfYear(now)
      break
    }
    case 'month': {
      rangeStartTime = startOfMonth(now)
      break
    }
    case 'day': {
      rangeStartTime = startOfDay(now)
      break
    }
    case 'hour': {
      rangeStartTime = startOfHour(now)
      break
    }
  }
  return rangeStartTime
}