import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'

dayjs.extend(utc)
dayjs.extend(timezone)

const useClock = ({ Timezone, CurrentTime }: { Timezone: string; CurrentTime: string }) => {
  const [currentTime, setCurrentTime] = useState<string>()

  useEffect(() => {
    let adjustedTime: dayjs.Dayjs

    if (CurrentTime) {
      // Parse the provided CurrentTime string and convert it to the specified timezone
      adjustedTime = dayjs(CurrentTime)
    } else {
      // If CurrentTime is not provided, use the current time in the specified timezone
      adjustedTime = dayjs().tz(Timezone)
    }

    const interval = setInterval(() => {
      // Update the current time every second
      setCurrentTime(adjustedTime.format('YYYY-MM-DD HH:mm:ss'))
      adjustedTime = adjustedTime.add(1, 'second')
    }, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [Timezone, CurrentTime])

  if (!currentTime) {
    return {
      currentTime: '',
      utcOffsetString: '',
    }
  }

  const utcOffset = dayjs().tz(Timezone).utcOffset()
  const sign = utcOffset >= 0 ? '+' : '-'
  const hours = Math.floor(Math.abs(utcOffset) / 60)
  const minutes = Math.abs(utcOffset) % 60
  const utcOffsetString = `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`

  // return `${formatDateTimeView(currentTime)} (${utcOffsetString})`
  return {
    currentTime: currentTime,
    utcOffsetString: utcOffsetString,
  }
}

export default useClock
