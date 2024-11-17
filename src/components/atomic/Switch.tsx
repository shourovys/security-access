import { Switch } from '@headlessui/react'
import classNames from 'classnames'
import { THandleInputSelect } from '../../types/components/common'
import t from '../../utils/translator'
import LoadingSvg from '../loading/atomic/LoadingSvg'
import Checkbox from './Checkbox'

interface IProps {
  name: string
  label?: string
  checked?: boolean
  isLoading?: boolean
  onChange?: THandleInputSelect
  disabled?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function SwitchButton({
  name,
  label,
  checked,
  isLoading,
  onChange,
  disabled,
  isSelected,
  handleSelect,
}: IProps) {
  return (
    <div className="flex flex-col gap-y-0.5">
      {label && (
        <div className="">
          {handleSelect ? (
            <div className="py-0.5">
              <Checkbox
                label={label}
                value={name}
                checked={isSelected}
                onChange={(_checked) => {
                  handleSelect(name, _checked)
                }}
              />
            </div>
          ) : (
            <label className="inline-block w-full text-sm text-gray-700 form-label" htmlFor={name}>
              {label}
            </label>
          )}
        </div>
      )}
      <Switch
        id={name}
        checked={checked}
        onChange={(isChecked: boolean) => {
          if (onChange) {
            onChange(name, isChecked)
          }
        }}
        className={classNames(
          checked && !disabled ? 'bg-primary text-blue-400' : 'bg-[#F0F1F3] text-gray-500',
          'relative inline-flex h-[34px] w-[70px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
          // disabled && "bg-[#F0F1F3]",
        )}
        disabled={disabled}
      >
        <span className="sr-only">{t`Use setting`}</span>
        <span
          aria-hidden="true"
          className={classNames(
            checked ? 'translate-x-9' : 'translate-x-0',
            disabled && checked ? 'bg-primary' : 'bg-white',
            'pointer-events-none flex items-center justify-center h-[30px] w-[30px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out'
          )}
        >
          {isLoading && <LoadingSvg size="extraLarge" />}
        </span>
      </Switch>
    </div>
  )
}

export default SwitchButton
