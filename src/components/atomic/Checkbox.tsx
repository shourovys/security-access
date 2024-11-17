import classNames from 'classnames'
import { ERROR_CLASS } from '../../utils/config'
import InputLoading from '../loading/atomic/InputLoading'

interface IProps {
  value: string
  checked?: boolean
  label?: string
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange: (checked: boolean) => void
  disabled?: boolean
  labelClassName?: string
}

function Checkbox({
  value,
  checked,
  label,
  isLoading,
  helpText,
  error,
  onChange,
  disabled = false,
  labelClassName,
}: IProps) {
  return (
    <div className="flex items-center justify-start space-x-2">
      {isLoading ? (
        <InputLoading />
      ) : (
        <input
          id={value}
          name={value}
          value={value}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          type="checkbox"
          // className="w-4 h-4 bg-gray-100 border-gray-300 rounded-md"
          className={classNames(
            'form-control block w-4 h-4 text-sm font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none disabled:bg-[#F0F1F3] disabled:text-gray-600',
            !disabled && 'cursor-pointer',
            error && ERROR_CLASS
          )}
          disabled={disabled}
        />
      )}
      {label && (
        <label
          htmlFor={value}
          className={classNames(
            'inline-block w-full text-sm text-gray-700 form-label',
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default Checkbox
