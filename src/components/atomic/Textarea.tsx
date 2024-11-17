import classNames from 'classnames'
import TextareaLoading from '../../components/loading/atomic/TextareaLoading'
import { THandleInputSelect } from '../../types/components/common'
import { ERROR_CLASS } from '../../utils/config'
import Checkbox from './Checkbox'

interface IInputProps {
  name: string
  label?: string
  value?: string
  placeholder?: string
  isLoading?: boolean
  helpText?: string
  error?: string | null
  row?: number
  onChange?: (name: string, value: string) => void
  disabled?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
  required?: boolean // modified by Imran
}
function Textarea({
  name,
  label = '',
  value,
  placeholder,
  isLoading,
  helpText,
  error,
  row = 6,
  onChange,
  disabled = false,
  isSelected,
  handleSelect,
  required, // modified by Imran
}: IInputProps) {
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
        <TextareaLoading />
      ) : (
        <textarea
          id={name}
          name={name}
          value={value}
          rows={row}
          placeholder={placeholder}
          onChange={(e) => (onChange ? onChange(name, e.target.value) : null)}
          className={classNames(
            'form-control block w-full px-3 py-1 text-sm font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none disabled:bg-[#F0F1F3] disabled:text-gray-600',
            !disabled && label && 'shadow-all-side',
            error && ERROR_CLASS
          )}
          disabled={disabled}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default Textarea
