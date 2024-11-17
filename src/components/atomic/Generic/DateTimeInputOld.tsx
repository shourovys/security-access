import classNames from 'classnames'
// @ts-ignore
import DateTimePicker from 'react-tailwindcss-datetimepicker'
import { DateValueType } from 'react-tailwindcss-datepicker/dist/types'
import { THandleInputSelect } from '../../../types/components/common'
import { ERROR_CLASS } from '../../../utils/config'
import InputLoading from '../../loading/atomic/InputLoading'
import Checkbox from './../Checkbox'

interface IProps {
  name: string
  label?: string
  value: {
    startDate: null | string
    endDate: null | string
  }
  placeholder?: string
  singleDate?: boolean
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, value: DateValueType) => void
  disabled?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function DateTimeInputOld({
  name,
  label = '',
  value,
  placeholder,
  singleDate = true,
  isLoading,
  helpText,
  error,
  onChange,
  disabled = false,
  isSelected,
  handleSelect,
}: IProps) {
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
        <DateTimePicker
          primaryColor="green"
          asSingle={singleDate}
          useRange={!singleDate}
          value={value}
          placeholder={placeholder}
          onChange={(newValue: DateValueType) => (onChange ? onChange(name, newValue) : null)}
          inputClassName={classNames(
            'form-control w-full h-[33.6px] px-3 text-sm font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 focus:border-gray-300 dark:border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none focus:ring-0',
            !disabled && label && 'shadow-all-side',
            disabled &&
              'important_disable_color important_disable_bg custom_opacity_100 custom_cursor_default',
            error && ERROR_CLASS
          )}
          containerClassName={classNames(
            disabled && 'important_disable_color important_disable_bg rounded-md '
          )}
          disabled={disabled}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default DateTimeInputOld
