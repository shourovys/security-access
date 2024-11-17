import { THandleInputSelect } from '../../../types/components/common'
import { INPUT_FIELD_HEIGHT } from '../../../utils/config'
import Checkbox from '../../atomic/Checkbox'
import InputLoading from '../../loading/atomic/InputLoading'

interface ICheckboxData {
  value: string
  label: string
}

interface IProps {
  name: string
  groupName: string
  inputLabel?: string
  checked?: string[]
  checkboxData?: ICheckboxData[]
  isLoading?: boolean
  // helpText?: string
  // error?: string | null
  onChange?: (name: string, value: string[]) => void
  disabled?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function PagesMultipleCheckbox({
  name,
  groupName,
  inputLabel,
  checked,
  checkboxData,
  isLoading,
  // helpText,
  // error,
  onChange,
  disabled = false,
  isSelected,
  handleSelect,
}: IProps) {
  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    if (onChange) {
      if (isChecked) {
        if (typeof checked !== 'undefined') {
          onChange(name, [...checked, value])
        } else {
          onChange(name, [value])
        }
      } else if (typeof checked !== 'undefined') {
        onChange(
          name,
          checked.filter((val) => val !== value)
        )
      }
    }
  }

  return (
    <div className="space-y-0.5 grid sm:grid-cols-3 lg:grid-cols-5 items-center">
      {inputLabel && (
        <>
          {handleSelect ? (
            <div className="py-0.5 sm:mr-4 mb-2 sm:mb-0 sm:border-r flex items-center h-full">
              <Checkbox
                label={inputLabel}
                value={groupName}
                checked={isSelected}
                onChange={(_checked) => {
                  handleSelect(groupName, _checked)
                }}
                labelClassName="font-medium"
              />
            </div>
          ) : (
            <label
              className="inline-block w-full text-sm text-gray-700 form-label"
              htmlFor={groupName}
            >
              {inputLabel}
            </label>
          )}
        </>
      )}

      {isLoading ? (
        <InputLoading />
      ) : (
        <div
          className="gap-x-4 gap-y-1 sm:col-span-2 lg:col-span-4 grid grid-cols-2 lg:grid-cols-4"
          style={{ minHeight: INPUT_FIELD_HEIGHT }}
        >
          {checkboxData?.map(({ value, label }) => (
            <Checkbox
              key={value}
              value={value}
              checked={checked?.includes(value)}
              label={label}
              onChange={(isChecked) => handleCheckboxChange(value, isChecked)}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>} */}
      {/* {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>} */}
    </div>
  )
}

export default PagesMultipleCheckbox
