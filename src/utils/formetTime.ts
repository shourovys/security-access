import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export type TimeFormatType = 'HH:mm:ss' | 'hh:mm A'
export type DateFormatType = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY'

export const timeFormat: TimeFormatType =
  (sessionStorage.getItem('time_format') as TimeFormatType) || 'HH:mm:ss'

export const dateFormat: DateFormatType =
  (sessionStorage.getItem('date_format') as DateFormatType) || 'YYYY-MM-DD'

export const systemTimezone = sessionStorage.getItem('timezone') || 'UTC'

export const dateTimeFormat = `${dateFormat} ${timeFormat}`

// export const formatTimeView = (timeStr: string) => {
//   return dayjs(timeStr).format(timeFormat)
// }

// export const formatTimeViewFromNumber = (timestamp: number) => {
//   return dayjs.unix(timestamp).format(timeFormat)
// }

export const formatDateView = (dateStr: string) => {
  return dayjs(dateStr).format(dateFormat) //modified by Imran  utcOffset(0)
}

export const formatDateTzView = (dateStr: string) => {
  return dayjs(dateStr).tz(systemTimezone).format(dateFormat)
}

//
// export const formatDateViewFromNumber = (timestamp: number) => {
//   return dayjs.unix(timestamp).format(dateFormat)
// }

export const formatDateTimeView = (dateStr: string | number) => {
  if (typeof dateStr === 'number') {
    return dayjs.unix(dateStr).format(dateTimeFormat)
  }
  return dayjs(dateStr).format(dateTimeFormat)
}

export const formatDateTimeTzView = (timestamp: number) => {
  return dayjs.unix(timestamp).tz(systemTimezone).format(dateTimeFormat)
}

export const getCurrentTimeByTimezone = (timezone: string) => {
  return dayjs().tz(timezone).format('YYYY-MM-DD HH:mm:ss')
}

export const getPlaybackRecordedTime = (timestamp: number) => {
  return dayjs.unix(timestamp).tz(systemTimezone).format('YYYY-MM-DD HH:mm') + ':00'
}

// export const formatMomentView = (datetime: dayjs.Dayjs) => {
//   return datetime.format(dateTimeFormat)
// }

export const htmlInputDatetimeFormatter = (
  dateStr: string | number,
  timezone: string | null = null
) => {
  if (timezone) {
    // todo: fix timezone
    return dayjs(dateStr).format('YYYY-MM-DDTHH:mm:ss')
  }
  return dayjs(dateStr).format('YYYY-MM-DDTHH:mm:ss')
}

export function convert12to24(time12: string): string {
  const [time, period] = time12.split(' ')
  let [hours, minutes, seconds] = time.split(':').map(Number)

  // Adjust hours if they are in PM and not 12 PM
  if (period === 'PM' && hours !== 12) {
    hours += 12
  }

  // Adjust hours if they are in AM and it's 12 AM
  if (period === 'AM' && hours === 12) {
    hours = 0
  }

  // Ensure hours, minutes, and seconds are formatted correctly
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  // const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`

  return `${formattedHours}:${formattedMinutes}`
}
