import classNames from 'classnames'
import { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { THandleInputSelect } from '../../types/components/common'
import { ERROR_CLASS } from '../../utils/config'
import { timeFormat } from '../../utils/formetTime'
import InputLoading from '../loading/atomic/InputLoading'
import Checkbox from './Checkbox'

interface IProps {
  name: string
  label?: string
  value?: string // Use the 'HH:mm:ss' format
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, value: string) => void
  disabled?: boolean
  isSelected?: boolean
  handleSelect?: THandleInputSelect
  // Show only time input
  showTimeSelect?: boolean
  format?: string
  placeholder?: string
  required?: boolean // modified by Imran
}

function TimeInput({
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
  format,
  placeholder,
  required, // modified by Imran
}: IProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const timeFormat24Hours = timeFormat === 'HH:mm:ss'

  useEffect(() => {
    if (value) {
      const timeArray = value.split(':').map(Number)
      const date = new Date()
      date.setHours(timeArray[0])
      date.setMinutes(timeArray[1])
      date.setSeconds(timeArray[2] || 0)
      setSelectedDate(date)
    }
  }, [value])

  const handleChange = (date: Date | null) => {
    if (onChange) {
      if (date) {
        // Only time is selected, add the time to the value
        const time = date.toTimeString().split(' ')[0]
        onChange(name, timeFormat24Hours ? time : time.replace(/\s/, ''))
      } else {
        setSelectedDate(null)
      }
    }
  }

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
              {required && <span className="text-red-500">*</span>} {/* modified by Imran */}
            </label>
          )}
        </>
      )}
      {isLoading ? (
        <InputLoading />
      ) : (
        <ReactDatePicker
          selected={selectedDate}
          onChange={handleChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeCaption="Time"
          strictParsing={false}
          dateFormat={format ? format : timeFormat24Hours ? 'HH:mm' : 'hh:mm aa'}
          timeFormat={format ? format : timeFormat24Hours ? 'HH:mm' : 'hh:mm aa'}
          placeholderText={placeholder ? placeholder : 'Select Time'}
          disabled={disabled}
          className={classNames(
            'form-control block w-full px-3 py-1 text-sm font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none disabled:bg-[#F0F1F3] disabled:text-gray-600',
            !disabled && 'focus:bg-white focus:border-primary focus:outline-none ',
            !disabled && label && 'shadow-all-side',
            error && ERROR_CLASS
          )}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default TimeInput
