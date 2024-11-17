import classNames from 'classnames'
import { useEffect } from 'react'
import { THandleInputSelect } from '../../types/components/common'
import { ERROR_CLASS, INPUT_FIELD_HEIGHT } from '../../utils/config'
import InputLoading from '../loading/atomic/InputLoading'
import Checkbox from './Checkbox'

interface IProps {
  name: string
  inputLabel?: string
  checked?: string | number
  radios: { label: string; value: string | number }[]
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, value: string | number) => void
  disabled?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function RadioButtons({
  name,
  inputLabel,
  checked,
  radios,
  isLoading,
  helpText,
  error,
  onChange,
  disabled = false,
  isSelected,
  handleSelect,
}: IProps) {
  //added by Imran start
  const handleCheckboxChange = (_checked: boolean) => {
    if (handleSelect) {
      handleSelect(name, _checked)

      // Save the checked state to sessionStorage
      sessionStorage.setItem(`${name}_isChecked`, JSON.stringify(_checked))
    }
  }

  // Load the initial value for isSelected from sessionStorage on component mount
  useEffect(() => {
    const savedSelected = sessionStorage.getItem(`${name}_isChecked`)
    if (savedSelected !== null && handleSelect) {
      handleSelect(name, JSON.parse(savedSelected))
    }
  }, [handleSelect, name])
  //added by Imran end

  return (
    <div className="w-full space-y-0.5">
      {inputLabel && (
        <>
          {handleSelect ? (
            <div className="py-0.5">
              <Checkbox
                label={inputLabel}
                value={name}
                checked={isSelected}
                onChange={handleCheckboxChange}
              />
            </div>
          ) : (
            <label className="inline-block w-full text-sm text-gray-700 form-label" htmlFor={name}>
              {inputLabel}
            </label>
          )}
        </>
      )}
      {isLoading ? (
        <InputLoading />
      ) : (
        <div
          className="flex flex-wrap items-center text-sm gap-x-4 gap-y-1"
          style={{ minHeight: INPUT_FIELD_HEIGHT }}
        >
          {radios.map(({ label, value }) => (
            <label
              key={label}
              htmlFor={label}
              className={classNames(
                'flex justify-center items-center py-1',
                disabled ? 'cursor-default' : 'cursor-pointer'
              )}
            >
              <input
                id={label}
                value={value}
                checked={value === checked}
                onChange={(e) => (onChange ? onChange(name, e.target.value) : null)}
                type="radio"
                className={classNames(
                  'float-left w-3.5 h-3.5 mr-1 align-middle transition duration-200  bg-center bg-no-repeat bg-contain border-2 border-gray-400 rounded-full appearance-none cursor-pointer checked:border-4 form-check-input checked:border-primary focus:outline-none',
                  disabled ? 'cursor-default bg-[#F0F1F3]' : 'bg-white checked:bg-white',
                  error && ERROR_CLASS
                )}
                disabled={disabled}
              />
              <span
                className={classNames(
                  'inline-block form-check-label',
                  !disabled && ' text-gray-800'
                )}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default RadioButtons

// use example
// <RadioButtons
//     name="radio"
//     inputlabel={t`Input Label`}
//     checked={formData.radio}
//     radios={[
//         {
//             label: "Radio Button 1",
//             value: "radio button 1",
//         },
//         {
//             label: "Radio Button 2",
//             value: "radio button 2",
//         },
//     ]}
//     onChange={handleInputChange}
// />;
