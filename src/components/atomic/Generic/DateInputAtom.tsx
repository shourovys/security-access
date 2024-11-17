import React, { useEffect, useRef, useState } from 'react'
import { LOCAL_STORAGE_KEY } from '../../../utils/config'

interface IPropsAtom {
  name: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  setHelperText: (text: string | undefined) => void
  isFocus?: boolean
  autoFocus?: boolean
}

function DateInputAtom({
  name,
  value,
  onChange,
  disabled = false,
  isFocus,
  setHelperText,
  autoFocus = true,
}: IPropsAtom) {
  const _zeroPad = (value: string, length: number = 2) => value.padStart(2, '0').slice(length * -1)

  const getDateProps = (() => {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (value && regex.test(value)) {
      const [y, m, d] = value.split('-')
      return [_zeroPad(y, 4), _zeroPad(m), _zeroPad(d)]
    } else {
      return ['', '', ''] // year, month, day
    }
  })()

  const yearInputRef = useRef<HTMLInputElement>(null)
  const monthInputRef = useRef<HTMLInputElement>(null)
  const dayInputRef = useRef<HTMLInputElement>(null)
  const [year, setYear] = useState<string>(getDateProps[0]) // 2000-2099
  const [month, setMonth] = useState<string>(getDateProps[1]) // 1-12
  const [day, setDay] = useState<string>(getDateProps[2]) // 1-31

  useEffect(() => {
    const a = document.activeElement
    if (
      isFocus &&
      autoFocus &&
      a !== yearInputRef.current &&
      a !== monthInputRef.current &&
      a !== dayInputRef.current
    ) {
      if (yearInputRef.current) yearInputRef.current.focus()
    }
  }, [isFocus])

  const _onYearBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const y = parseInt(e.target.value)
    if (y >= 1900 && y <= 2099) {
      setYear(_zeroPad(e.target.value, 4))
      setHelperText(undefined)
    } else {
      setYear('')
      setHelperText('Please enter a valid year between 1900-2099')
    }
  }

  const _onMonthBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value >= 1 && value <= 12) {
      setHelperText(undefined)
      setMonth(_zeroPad(e.target.value))
    } else {
      setHelperText('Please enter a valid month between 01-12')
      setMonth('')
    }
  }

  const _onDayBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value >= 1 && value <= 31) {
      setHelperText(undefined)
      setDay(_zeroPad(e.target.value))
    } else {
      setHelperText('Please enter a valid day between 01-31')
      setDay('')
    }
  }

  useEffect(() => {
    if (year && month && day && year.length === 4 && month !== '' && day !== '') {
      const date = new Date(`${year}-${month}-${day}`)
      if (date.toString() === 'Invalid Date') {
        setHelperText('Please enter a valid date')
      } else {
        setHelperText(undefined)
        onChange && onChange(`${_zeroPad(year, 4)}-${_zeroPad(month)}-${_zeroPad(day)}` as string)
      }
    }
  }, [year, month, day])

  useEffect(() => {
    if (value && value !== '') {
      setYear(getDateProps[0])
      setMonth(getDateProps[1])
      setDay(getDateProps[2])
    }
  }, [value])

  const yearJsx = (
    <input
      className="border-0 focus:ring-0 focus:outline-none input_number_spinner bg-inherit"
      type="number"
      name={`${name}Year`}
      value={year}
      placeholder="YYYY"
      min={1900}
      max={2099}
      maxLength={4}
      ref={yearInputRef}
      onChange={(e) => setYear(e.target.value)}
      onBlur={_onYearBlur}
      disabled={disabled}
    />
  )

  const monthJsx = (
    <input
      className="border-0 focus:ring-0 focus:outline-none input_number_spinner"
      type="number"
      name={`${name}Month`}
      value={month}
      placeholder="MM"
      ref={monthInputRef}
      min={1}
      max={12}
      maxLength={2}
      onChange={(e) => setMonth(e.target.value)}
      disabled={disabled}
      onBlur={_onMonthBlur}
    />
  )

  const dayJsx = (
    <input
      className="border-0 focus:ring-0 focus:outline-none input_number_spinner"
      type="number"
      name={`${name}Day`}
      value={day}
      placeholder="DD"
      ref={dayInputRef}
      min={1}
      max={31}
      maxLength={2}
      onChange={(e) => setDay(e.target.value)}
      disabled={disabled}
      onBlur={_onDayBlur}
    />
  )

  const gapJsx = (e: string) => <span className="px-1">{e}</span>
  // "YYYY-MM-DD",
  // "MM/DD/YYYY",
  // "DD/MM/YYYY",
  const dateFormat = sessionStorage.getItem(LOCAL_STORAGE_KEY.dateFormat)

  if (dateFormat === 'MM/DD/YYYY') {
    return (
      <div className="inline-block min-w-min">
        {monthJsx}
        {gapJsx('/')}
        {dayJsx}
        {gapJsx('/')}
        {yearJsx}
      </div>
    )
  } else if (dateFormat === 'DD/MM/YYYY') {
    return (
      <div className="inline-block min-w-min">
        {dayJsx}
        {gapJsx('/')}
        {monthJsx}
        {gapJsx('/')}
        {yearJsx}
      </div>
    )
  } else {
    return (
      <div className="inline-block min-w-min">
        {yearJsx}
        {gapJsx('-')}
        {monthJsx}
        {gapJsx('-')}
        {dayJsx}
      </div>
    )
  }
}

export default DateInputAtom
