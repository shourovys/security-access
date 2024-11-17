import React, { useEffect, useRef, useState } from 'react'

interface IPropsAtom {
  name: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean

  helpText?: string
  setHelperText: (text: string | undefined) => void

  isFocus?: boolean
  autoFocus?: boolean
}

const TimeInputAtom = ({
  name,
  value,
  onChange,
  disabled,
  isFocus,
  setHelperText,
  autoFocus = true,
}: IPropsAtom) => {
  // const is_24_hour_format = sessionStorage.getItem(LOCAL_STORAGE_KEY.timeFormat) === 'HH:mm:ss'
  const is_24_hour_format = true
  const _zeroPad = (value: string) => value.padStart(2, '0').slice(-2)
  const getPropsTime: [string, string, 'AM' | 'PM'] = (() => {
    // check regex of hh:mm
    if (value && value.match(/^\d{2}:\d{2}$/)) {
      const [h, m] = value.split(':').map((v) => _zeroPad(v))
      if (is_24_hour_format || parseInt(h) <= 12) {
        return [h, m, 'AM']
      } else {
        return [(parseInt(h) - 12).toString(), m, 'PM']
      }
    } else {
      return ['', '', 'AM']
    }
  })()

  const hourInputRef = useRef<HTMLInputElement>(null)
  const minuteInputRef = useRef<HTMLInputElement>(null)
  const ampmInputRef = useRef<HTMLSelectElement>(null)
  const [hours, setHours] = useState<string>(getPropsTime[0]) // 0-24
  const [minutes, setMinutes] = useState<string>(getPropsTime[1]) // 0-59
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(getPropsTime[2]) // AM/PM

  useEffect(() => {
    const a = document.activeElement
    if (
      isFocus &&
      autoFocus &&
      a !== hourInputRef.current &&
      a !== minuteInputRef.current &&
      a !== ampmInputRef.current
    ) {
      if (hourInputRef.current) hourInputRef.current.focus()
    }
  }, [isFocus])

  // 0 pad and take last 2 digits

  const _onHourBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (is_24_hour_format && value >= 0 && value <= 24) {
      setHelperText(undefined)
      setHours(_zeroPad(e.target.value))
    } else if (!is_24_hour_format && value >= 1 && value <= 12) {
      setHelperText(undefined)
      setHours(_zeroPad(e.target.value))
    } else {
      setHelperText(`Please enter a valid hour between ${is_24_hour_format ? '00-24' : '01-12'}`)
      setHours('')
    }
  }

  const _onMinuteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value >= 0 && value <= 59) {
      setHelperText(undefined)
      setMinutes(_zeroPad(e.target.value))
    } else {
      setHelperText('Please enter a valid minute between 00-59')
      setMinutes('')
    }
  }

  const _onAmpmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmpm(e.target.value as 'AM' | 'PM')
  }

  useEffect(() => {
    if (value) {
      setHours(getPropsTime[0])
      setMinutes(getPropsTime[1])
      setAmpm(getPropsTime[2])
    }
  }, [value])

  useEffect(() => {
    let v = `${_zeroPad(hours)}:${_zeroPad(minutes)}`
    if (!is_24_hour_format && ampm === 'PM') {
      v = `${_zeroPad((parseInt(hours) + 12).toString())}:${_zeroPad(minutes)}`
    }
    if (value !== v) {
      onChange && onChange(v)
    }
  }, [hours, minutes, ampm])

  return (
    <>
      <input
        className="border-0 focus:ring-0 focus:outline-none input_number_spinner bg-inherit min-w-min text-center"
        type="number"
        name={`${name}Hour`}
        value={hours}
        placeholder="HH"
        min={is_24_hour_format ? 0 : 1}
        max={is_24_hour_format ? 24 : 12}
        maxLength={2}
        ref={hourInputRef}
        onChange={(e) => setHours(e.target.value)}
        onBlur={_onHourBlur}
        disabled={disabled}
      />

      <span className="px-1">:</span>

      <input
        className="w-8 border-0 focus:ring-0 focus:outline-none input_number_spinner min-w-min"
        type="number"
        name={`${name}Minute`}
        value={minutes}
        placeholder="mm"
        ref={minuteInputRef}
        min={0}
        max={59}
        maxLength={2}
        onChange={(e) => setMinutes(e.target.value)}
        onBlur={_onMinuteBlur}
        disabled={disabled}
      />

      {/*show AM/PM select if 12 hour format*/}
      {!is_24_hour_format && (
        <select
          className="border-0 focus:ring-0 focus:outline-none"
          name={`${name}AMPM`}
          value={ampm}
          ref={ampmInputRef}
          onChange={_onAmpmChange}
          disabled={disabled}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      )}
    </>
  )
}
export default TimeInputAtom
