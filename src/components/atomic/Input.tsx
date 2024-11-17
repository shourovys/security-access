import classNames from 'classnames'
import { THandleInputSelect } from '../../types/components/common'
import { ERROR_CLASS } from '../../utils/config'
import InputLoading from '../loading/atomic/InputLoading'
import Checkbox from './Checkbox'

interface IProps {
  type?: string
  name: string
  label?: string
  value?: string | number
  placeholder?: string
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, value: string) => void
  disabled?: boolean
  required?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
  [rest: string]: unknown
}

function Input({
  type = 'text',
  name,
  label = '',
  value,
  placeholder,
  isLoading,
  helpText,
  error,
  onChange,
  disabled = false,
  required,
  isSelected,
  handleSelect,
  ...rest
}: IProps) {
  // useEffect(() => {
  //   if (type === 'number' && !value) {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //     onChange ? onChange(name, '0') : null
  //   }
  // }, [])

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
              {required && <span className="text-red-500">*</span>}
            </label>
          )}
        </>
      )}
      {isLoading ? (
        <InputLoading />
      ) : (
        <input
          id={name}
          name={name}
          defaultValue={0}
          value={value}
          placeholder={placeholder}
          type={type}
          onChange={(e) => (onChange ? onChange(name, e.target.value) : null)}
          className={classNames(
            'form-control block w-full px-3 py-1 text-sm font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none disabled:bg-[#F0F1F3] disabled:text-gray-600',
            !disabled && label && 'shadow-all-side',
            error && ERROR_CLASS,
            !value &&
              placeholder &&
              `before:content-['${placeholder}'] before:mr-4 before:text-gray-400`
          )}
          disabled={disabled}
          {...rest}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default Input
