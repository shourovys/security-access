import classNames from 'classnames'
// import { useEffect } from 'react'
import Select from 'react-tailwindcss-select'
import useSWRGlobalState from '../../hooks/useSWRGlobalState'
import { THandleInputSelect } from '../../types/components/common'
import { ERROR_CLASS } from '../../utils/config'
import t from '../../utils/translator'
import InputLoading from '../loading/atomic/InputLoading'
import Checkbox from './Checkbox'

export interface ISelectOption {
  value: string
  label: string
}
export type TSelectValue = ISelectOption | ISelectOption[] | null | undefined

interface IProps {
  name: string
  label?: string
  value?: TSelectValue
  options?: ISelectOption[]
  placeholder?: string
  isLoading?: boolean
  multiple?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, selectedValue: TSelectValue) => void
  isSearchable?: boolean
  isClearable?: boolean
  disabled?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
  required?: boolean // modified by Imran
}

function Selector({
  name,
  label = '',
  value = null,
  options = [],
  placeholder = t('Select your option'),
  isLoading,
  multiple,
  helpText,
  error,
  onChange,
  isSearchable,
  isClearable,
  disabled,
  isSelected,
  handleSelect,
  required,
}: IProps) {
  const handleChange = (selected: TSelectValue) => {
    if (onChange) {
      onChange(name, selected)
    }
  }

  // useEffect(() => {
  //   // this code not work in edit pages
  //   if (!value && !isClearable && options.length) {
  //     handleChange(options[0])
  //   }
  // }, [value, options, isClearable])

  const [isMenuOpen, setIsMenuOpen] = useSWRGlobalState<boolean>('menuOpenState', false)

  const valueIsObject = value && typeof value === 'object' && 'label' in value
  const isValuePresent = valueIsObject ? value?.label : value?.length
  return (
    <div
      className={classNames('w-full space-y-0.5', isMenuOpen && 'selector_relative_position')}
      onClick={() => {
        setIsMenuOpen(false)
      }}
    >
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
        <Select
          primaryColor="#006AFE"
          // name={name}
          // id={name}
          value={value}
          onChange={handleChange}
          isMultiple={multiple}
          isDisabled={disabled}
          isSearchable={isSearchable}
          classNames={{
            menuButton: (arg) =>
              classNames(
                'flex overflow-hidden pl-0.5 h-[30px] items-center justify-between text-sm font-normal bg-white border border-solid border-gray-300 rounded-md focus:text-gray-700',
                !arg?.isDisabled && label && 'shadow-all-side text-gray-600',

                isValuePresent ? 'text-black' : 'custom_text_gray',
                !arg?.isDisabled && 'focus:bg-white focus:border-primary focus:outline-none ',
                arg?.isDisabled && 'important_disable_bg',
                arg?.isDisabled && isValuePresent && 'important_disable_color',

                error && ERROR_CLASS
              ),
            // menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
            // listItem: ({ isSelected }) =>
            //     `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
            //         isSelected
            //             ? `text-white bg-blue-500`
            //             : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
            //     }`,
          }}
          options={options}
          placeholder={placeholder}
          isClearable={isClearable}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}

      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default Selector
