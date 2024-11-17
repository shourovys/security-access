import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { THandleInputSelect } from '../../../types/components/common'
import { ERROR_CLASS } from '../../../utils/config'
import InputLoading from '../../loading/atomic/InputLoading'
import Checkbox from '../Checkbox'
import TimeInputAtom from './TimeInputAtom'

interface IProps {
  name: string
  label?: string
  value?: string
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, value: string) => void
  disabled?: boolean
  required?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function TimeInput({
  name,
  label = '',
  value,
  isLoading,
  helpText,
  error,
  onChange,
  disabled = false,
  required,
  isSelected,
  handleSelect,
}: IProps) {
  const [isFocus, setIsFocus] = useState(false)
  const [ownHelpText, setOwnHelpText] = useState<string | undefined>(helpText)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  // detect click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputBoxRef.current && !inputBoxRef.current.contains(e.target as Node)) {
        setIsFocus(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
              {required && <span className="text-red-500"> *</span>}
            </label>
          )}
        </>
      )}
      {isLoading ? (
        <InputLoading />
      ) : (
        <div
          className={classNames(
            'form-control flex w-full py-1.5 text-sm font-normal text-black bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0 disabled:bg-[#F0F1F3] disabled:text-gray-600',
            !disabled && label && 'shadow-all-side  bg-white',
            !disabled && isFocus && 'text-gray-700 bg-white border-primary outline-none',
            error && ERROR_CLASS,
            disabled && 'bg-gray-100 text-gray-600'
          )}
          onClick={() => setIsFocus(true)}
          ref={inputBoxRef}
        >
          <TimeInputAtom
            name={name}
            setHelperText={setOwnHelpText}
            isFocus={isFocus}
            value={value}
            onChange={(v) => onChange && onChange(name, v)}
            disabled={disabled}
          />
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {ownHelpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{ownHelpText}</p>}
    </div>
  )
}

export default TimeInput
