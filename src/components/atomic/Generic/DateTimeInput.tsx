import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { THandleInputSelect } from '../../../types/components/common'
import { ERROR_CLASS } from '../../../utils/config'
import InputLoading from '../../loading/atomic/InputLoading'
import Checkbox from '../Checkbox'
import DateInputAtom from './DateInputAtom'
import TimeInputAtom from './TimeInputAtom'

interface IProps {
  name: string
  label?: string
  value?: string
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, value: string) => void
  disabled?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function DateTimeInput({
  name,
  label = '',
  value,
  isLoading,
  helpText,
  error,
  onChange,
  disabled = false,
  isSelected,
  handleSelect,
}: IProps) {
  const _zeroPad = (value: string, length: number = 2) => value.padStart(2, '0').slice(length * -1)

  const getDateTimeProps = (() => {
    let year = '',
      month = '',
      day = '',
      hour = '',
      minute = '',
      ampm = 'AM'

    if (value) {
      //  2021-09-01T12:00 or 2021-09-01T12:00:00
      if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/)) {
        const [date, time] = value.split('T')
        ;[year, month, day] = date.split('-')
        ;[hour, minute] = time.split(':')
      }

      //12/10/2023 05:11 AM
      else if (value.match(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} (AM|PM)$/)) {
        ;[day, month, year] = value.split(' ')[0].split('/')
        ;[hour, minute] = value.split(' ')[1].split(':')
        ampm = value.split(' ')[2]
        if (ampm === 'PM') {
          hour = (parseInt(hour) + 12).toString()
        }
      }
      //12/10/2023 05:19:44
      else if (value.match(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/)) {
        ;[day, month, year] = value.split(' ')[0].split('/')
        ;[hour, minute] = value.split(' ')[1].split(':')
      } else {
        ;[year, month, day] = ['', '', '']
        console.error('Invalid date time format : ' + value)
      }
      year = _zeroPad(year, 4)
      month = _zeroPad(month)
      day = _zeroPad(day)
      hour = _zeroPad(hour)
      minute = _zeroPad(minute)

      const t = `${hour}:${minute}`
      const d = `${year}-${month}-${day}`
      return [d, t]
    } else {
      return ['', '']
    }
  })()

  const [isFocus, setIsFocus] = useState(false)
  const [ownHelpText, setOwnHelpText] = useState<string | undefined>(helpText)
  const inputBoxRef = useRef<HTMLDivElement>(null)
  const [timeInputValue, setTimeInputValue] = useState<string>(getDateTimeProps[1])
  const [dateInputValue, setDateInputValue] = useState<string>(getDateTimeProps[0])

  // detect click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputBoxRef.current && !inputBoxRef.current.contains(e.target as Node)) {
        setIsFocus(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (value) {
      if (getDateTimeProps[0] !== dateInputValue) {
        setDateInputValue(getDateTimeProps[0])
      }
      if (getDateTimeProps[1] !== timeInputValue) {
        setTimeInputValue(getDateTimeProps[1])
      }
    }
  }, [value])

  useEffect(() => {
    if (`${dateInputValue}T${timeInputValue}` !== value) {
      onChange && onChange(name, `${dateInputValue}T${timeInputValue}`)
    }
  }, [dateInputValue, timeInputValue])

  return (
    <div className="w-full space-y-0.5">
      {label && (
        <>
          {handleSelect ? (
            <div className="py-0.5">
              <Checkbox
                label={label}
                value={name}
                checked={isSelected}
                onChange={(checked) => {
                  handleSelect(name, checked)
                }}
              />
            </div>
          ) : (
            <label className="inline-block w-full text-sm text-gray-700 form-label" htmlFor={name}>
              {label}
            </label>
          )}
        </>
      )}
      {isLoading ? (
        <InputLoading />
      ) : (
        <div
          className={classNames(
            'form-control flex w-full px-3 py-1.5 text-sm font-normal text-black bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0',
            !disabled && label && 'shadow-all-side  bg-white ',
            !disabled && isFocus && 'text-gray-700 bg-white border-primary outline-none',
            error && ERROR_CLASS,
            disabled && 'bg-gray-100 text-gray-600'
          )}
          onClick={() => setIsFocus(true)}
          ref={inputBoxRef}
        >
          <DateInputAtom
            name={name}
            setHelperText={setOwnHelpText}
            value={dateInputValue}
            onChange={setDateInputValue}
            isFocus={isFocus}
            disabled={disabled}
          />
          <span className="px-1 text-gray-300">|</span>
          <TimeInputAtom
            name={name}
            setHelperText={setOwnHelpText}
            isFocus={isFocus}
            value={timeInputValue}
            onChange={setTimeInputValue}
            disabled={disabled}
            autoFocus={false}
          />
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {ownHelpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{ownHelpText}</p>}
    </div>
  )
}

export default DateTimeInput
