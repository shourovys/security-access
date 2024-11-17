import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import InputLoading from '../loading/atomic/InputLoading'
import Checkbox from './Checkbox'
import { ISelectOption } from './Selector'

interface IProps {
  name: string
  label?: string
  value?: string
  placeholder?: string
  isLoading?: boolean
  helpText?: string
  error?: string | null
  onChange?: (name: string, value: string) => void
  disabled?: boolean
  required?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: (name: string, value: boolean) => void
  options?: ISelectOption[]
}

const InputWithOption: React.FC<IProps> = ({
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
  options = [],
}: IProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null) // Change to div ref
  const inputRef = useRef<HTMLInputElement>(null) // Add input ref

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (onChange) {
      onChange(name, inputValue)
    }
    setShowSuggestions(inputValue.trim().length > 0)
  }

  const handleSuggestionClick = (option: ISelectOption) => {
    if (onChange) {
      onChange(name, option.value)
    }
    setShowSuggestions(false)
  }

  const handleFocus = () => {
    // Open suggestion list when input field focus
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    // Close suggestion list when input field loses focus
    setTimeout(() => {
      setShowSuggestions(false)
    }, 10) // Adjust the delay as needed
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && showSuggestions) {
      // Move focus down in suggestion list
      e.preventDefault()
      setHighlightedIndex((prevIndex) =>
        prevIndex === null || prevIndex === options.length - 1 ? 0 : prevIndex + 1
      )
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      // Move focus up in suggestion list
      e.preventDefault()
      setHighlightedIndex((prevIndex) =>
        prevIndex === null || prevIndex === 0 ? options.length - 1 : prevIndex - 1
      )
    } else if (e.key === 'Enter' && showSuggestions && highlightedIndex !== null) {
      // Select highlighted suggestion
      handleSuggestionClick(options[highlightedIndex])
    }
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (
      !inputContainerRef.current?.contains(e.target as Node) &&
      !inputRef.current?.contains(e.target as Node)
    ) {
      setShowSuggestions(false)
    }
  }

  // Attach click outside event listener when suggestion list is shown
  useEffect(() => {
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  return (
    <div className="w-full space-y-0.5 relative" ref={inputContainerRef}>
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
        <>
          <input
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            type="text"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className={classNames(
              'form-control block w-full px-3 py-1 text-sm font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none disabled:bg-[#F0F1F3] disabled:text-gray-600',
              !disabled && label && 'shadow-all-side',
              error && 'border-red-500',
              !value &&
                placeholder &&
                `before:content-['${placeholder}'] before:mr-4 before:text-gray-400`
            )}
            disabled={disabled}
          />
          {showSuggestions && options.length > 0 && (
            <ul className="mt-1 py-1.5 border border-gray-300 rounded-md shadow-md bg-white absolute z-10 w-full max-h-52 overflow-y-scroll">
              {options.map((option, index) => (
                <li
                  key={option.value}
                  className={classNames('cursor-pointer px-3 py-1 hover:bg-gray-100 text-sm', {
                    'bg-gray-100': index === highlightedIndex,
                  })}
                  onClick={() => handleSuggestionClick(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default InputWithOption
