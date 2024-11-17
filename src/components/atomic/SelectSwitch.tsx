import { Switch } from '@headlessui/react'
import classNames from 'classnames'
import { THandleInputSelect } from '../../types/components/common'
import { booleanSelectOption } from '../../types/pages/common'
import t from '../../utils/translator'
import LoadingSvg from '../loading/atomic/LoadingSvg'
import Checkbox from './Checkbox'
import { ISelectOption } from './Selector'

interface IProps {
  name: string
  label?: string
  value?: ISelectOption | null
  isLoading?: boolean
  onChange?: (name: string, selectedValue: ISelectOption) => void
  disabled?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function SwitchButtonSelect({
  name,
  label,
  value,
  isLoading,
  onChange,
  disabled,
  isSelected,
  handleSelect,
}: IProps) {
  const checked = value?.value === '1'
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
            onChange(name, isChecked ? booleanSelectOption[1] : booleanSelectOption[0])
          }
        }}
        className={classNames(
          checked && !disabled ? 'bg-primary text-blue-400' : 'bg-[#F0F1F3] text-gray-500',
          'relative inline-flex h-[32px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
          // disabled && "bg-[#F0F1F3]",
        )}
        disabled={disabled}
      >
        <span className="sr-only">{t`Use setting`}</span>
        <span
          aria-hidden="true"
          className={classNames(
            checked ? 'translate-x-7' : 'translate-x-0',
            disabled && checked ? 'bg-primary' : 'bg-white',
            'pointer-events-none flex items-center justify-center h-[28px] w-[28px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out'
          )}
        >
          {isLoading && <LoadingSvg size="extraLarge" />}
        </span>
      </Switch>
    </div>
  )
}

export default SwitchButtonSelect
