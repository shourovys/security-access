import classNames from 'classnames'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react' // Import useEffect
import ReactDatePicker from 'react-datepicker'
import { THandleInputSelect } from '../../types/components/common'
import { ERROR_CLASS } from '../../utils/config'
import { dateFormat, timeFormat } from '../../utils/formetTime'
import InputLoading from '../loading/atomic/InputLoading'
import Checkbox from './Checkbox'

interface IProps {
  name: string
  label?: string
  value?: string
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, value: string) => void
  disabled?: boolean
  isSelected?: boolean
  handleSelect?: THandleInputSelect
  showTimeSelect?: boolean
  format?: string
  placeholder?: string
  required?: boolean
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
  showTimeSelect = true,
  format,
  placeholder,
  required,
}: IProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const dateFormatLocalMap: { [k: string]: string } = {
    'YYYY-MM-DD': 'yyyy-MM-dd',
    'MM/DD/YYYY': 'MM/dd/yyyy',
    'DD/MM/YYYY': 'dd/MM/yyyy',
  }
  const timeFormatLocalMap: { [k: string]: string } = {
    'HH:mm:ss': 'HH:mm',
    'hh:mm A': 'hh:mm aa',
  }
  const dateTimeFormat = `${dateFormatLocalMap[dateFormat]}${
    showTimeSelect ? ` ${timeFormatLocalMap[timeFormat]}` : ''
  }`

  // useEffect(() => {
  //   if (value) {
  //     // Parse the 'YYYY-MM-DDTHH:mm' format into a Date object
  //     setSelectedDate(dayjs(value).toDate())
  //   } else {
  //     setSelectedDate(null)
  //   }
  // }, [value]) // Update selectedDate when the value prop changes

  useEffect(() => {
    // Set the selectedDate state when the value prop changes
    if (value) {
      const parsedDate = dayjs(value, 'YYYY-MM-DDTHH:mm').toDate() // Assuming the value follows 'YYYY-MM-DDTHH:mm' format
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate)
      } else {
        setSelectedDate(null)
        // Handle the case where the date format is invalid
        console.error('Invalid date format:', value)
      }
    } else {
      setSelectedDate(null)
    }
  }, [value])

  const handleChange = (date: Date | null) => {
    if (onChange) {
      if (!showTimeSelect) {
        // Only date is selected, add the date to the value
        if (date) {
          onChange(name, dayjs(date).format('YYYY-MM-DD'))
        } else {
          onChange(name, '')
        }
      } else {
        // Both date and time are selected, add the full ISO string
        if (date) {
          onChange(name, dayjs(date).format('YYYY-MM-DDTHH:mm'))
        } else {
          onChange(name, '')
        }
      }
    }
    setSelectedDate(date)
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
              {required && <span className="text-red-500">&nbsp;*</span>}
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
          showTimeSelect={showTimeSelect}
          timeIntervals={60}
          timeCaption="Time"
          dateFormat={format ? format : dateTimeFormat}
          timeFormat={format ? 'HH:mm' : timeFormatLocalMap[timeFormat]}
          disabled={disabled}
          className={classNames(
            'form-control block w-full px-3 py-1 text-sm font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none disabled:bg-[#F0F1F3] disabled:text-gray-600',
            !disabled && 'focus:bg-white focus:border-primary focus:outline-none ',
            !disabled && label && 'shadow-all-side',
            error && ERROR_CLASS
          )}
          placeholderText={placeholder ? placeholder : 'Select Date and Time'}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default DateTimeInput
