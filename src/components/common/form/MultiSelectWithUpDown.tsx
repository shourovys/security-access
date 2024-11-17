import classNames from 'classnames'
import InputsContainer from '../../../components/HOC/style/form/InputsContainer'
import Checkbox from '../../../components/atomic/Checkbox'
import Input from '../../../components/atomic/Input'
import MultiSelectListLoading from '../../../components/loading/form/MultiSelectListLoading'
import React, { useEffect, useRef, useState } from 'react'
import { THandleInputSelect } from '../../../types/components/common'
import compareArrays from '../../../utils/compareArrays'
import { ERROR_CLASS } from '../../../utils/config'
import Icon, {
  downArrowIcon,
  leftArrowIcon,
  rightArrowIcon,
  upArrowIcon,
} from '../../../utils/icons'

interface MultiSelectOption {
  id: string
  label: string
}

interface MultiSelectProps {
  name: string
  label?: string
  value?: string[]
  onChange?: (name: string, value: string[]) => void
  options?: MultiSelectOption[]
  helpText?: string
  error?: string | null
  isLoading?: boolean
  disabled?: boolean
  moveUpDown?: boolean
  // props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function MultiSelect({
  name,
  label,
  value = [],
  onChange,
  options = [],
  helpText,
  error,
  isLoading,
  disabled,
  moveUpDown,
  isSelected,
  handleSelect,
}: MultiSelectProps) {
  // Define state variables and refs

  // Left options and right options state
  const [leftOptions, setLeftOptions] = useState<MultiSelectOption[]>([])
  const [rightOptions, setRightOptions] = useState<MultiSelectOption[]>([])

  // Refs to track options and value changes
  const optionsRef = useRef<MultiSelectOption[]>()
  const valueRef = useRef<string[]>()

  // Selected options in left and right lists
  const [selectedLeftOptions, setSelectedLeftOptions] = useState<string[]>([])
  const [selectedRightOptions, setSelectedRightOptions] = useState<string[]>([])

  // Search input values for left and right lists
  const [leftSearch, setLeftSearch] = useState<string>('')
  const [rightSearch, setRightSearch] = useState<string>('')

  // Filtered options for left and right lists
  const [leftOptionsFiltered, setLeftOptionsFiltered] = useState<MultiSelectOption[]>([])
  const [rightOptionsFiltered, setRightOptionsFiltered] = useState<MultiSelectOption[]>([])

  // Update left and right options when the component receives new props
  useEffect(() => {
    if (
      JSON.stringify(options) !== JSON.stringify(optionsRef.current) ||
      (JSON.stringify(value) !== JSON.stringify(valueRef) && value.length)
    ) {
      setLeftOptions(options.filter((option) => !value.includes(option.id)))
      setRightOptions(options.filter((option) => value.includes(option.id)))
    }
    optionsRef.current = options
    valueRef.current = value
  }, [options])

  // Handle selection in the left options list
  const handleLeftSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLeftOptions(Array.from(e.target.selectedOptions).map((o) => o.value))
  }

  useEffect(() => {
    if (leftSearch === '') {
      setLeftOptionsFiltered(leftOptions)
    } else {
      setLeftOptionsFiltered(
        leftOptions.filter((option) =>
          option.label.toLowerCase().includes(leftSearch.toLowerCase())
        )
      )
    }
  }, [leftSearch, leftOptions])

  // Handle selection in the right options list
  const handleRightSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRightOptions(Array.from(e.target.selectedOptions).map((o) => o.value))
  }

  // update formData onChange
  const updateFormData = (_options: MultiSelectOption[]) => {
    if (onChange) {
      onChange(
        name,
        _options.map((option) => option.id)
      )
    }
  }

  // Move selected options from left to right
  const handleMoveLeft = () => {
    if (disabled || leftOptions.length === 0) {
      return
    }
    setRightOptions([
      ...rightOptions,
      ...leftOptions.filter((option) => selectedLeftOptions.includes(option.id)),
    ])
    setLeftOptions(leftOptions.filter((option) => !selectedLeftOptions.includes(option.id)))
    setSelectedLeftOptions([])
  }

  // Move selected options from right to left
  const handleMoveRight = () => {
    if (disabled || rightOptions.length === 0) {
      return
    }
    setLeftOptions([
      ...leftOptions,
      ...rightOptions.filter((option) => selectedRightOptions.includes(option.id)),
    ])
    setRightOptions(rightOptions.filter((option) => !selectedRightOptions.includes(option.id)))
    setSelectedRightOptions([])
  }

  // Move selected options from bottom to left
  const handleMoveUp = () => {
    if (disabled || rightOptions.length < 2 || selectedRightOptions.length === 0) {
      return
    }
    setRightOptions((prevState) => {
      const newRightOptions = [...prevState]
      const firstItem = newRightOptions.shift()
      if (firstItem) {
        newRightOptions.push(firstItem)
      }
      return newRightOptions
    })
    // updateFormData(rightOptions)
  }

  const handleMoveDown = () => {
    if (disabled || rightOptions.length < 2 || selectedRightOptions.length === 0) {
      return
    }
    // setRightOptions((prevState) => {
    const newRightOptions = [...rightOptions]
    const lastItem = newRightOptions.pop()
    if (lastItem) {
      newRightOptions.unshift(lastItem)
    }
    // return newRightOptions
    // })
    updateFormData(newRightOptions)
  }

  // Filter left options based on search input
  useEffect(() => {
    if (leftSearch === '') {
      setLeftOptionsFiltered(leftOptions)
    } else {
      setLeftOptionsFiltered(
        leftOptions.filter((option) =>
          option.label.toLowerCase().includes(leftSearch.toLowerCase())
        )
      )
    }
  }, [leftSearch, leftOptions])

  // Filter right options based on search input
  useEffect(() => {
    if (rightSearch === '') {
      setRightOptionsFiltered(rightOptions)
    } else {
      setRightOptionsFiltered(
        rightOptions.filter((option) =>
          option.label.toLowerCase().includes(rightSearch.toLowerCase())
        )
      )
    }
  }, [rightSearch, rightOptions])

  // Update the value when right options change
  useEffect(() => {
    const assignValue = rightOptions.map((option) => option.id)

    if (
      onChange &&
      !compareArrays(assignValue, value)
      // &&
      // !!assignValue.length
    ) {
      onChange(
        name,
        rightOptions.map((option) => option.id)
      )
    }
  }, [rightOptions.length])
  // }, [rightOptions])

  return (
    <div className="w-full space-y-0.5">
      {/* Render label if provided */}
      {label && (
        <>
          {handleSelect ? (
            // Render a checkbox in the label if handleSelect prop is provided
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
            // Render a regular label if handleSelect prop is not provided
            <label className="inline-block w-full text-sm text-gray-700 form-label" htmlFor={name}>
              {label}
            </label>
          )}
        </>
      )}
      <div
        className={classNames(
          'flex flex-wrap justify-center gap-2 sm:justify-start sm:flex-nowrap sm:gap-6 md:gap-4 xl:gap-8',
          error && ERROR_CLASS
        )}
      >
        {/* Left side input container */}
        <InputsContainer>
          {/* Input field for left side search */}
          <Input
            name="leftSearch"
            value={leftSearch}
            onChange={(n, inputValue) => setLeftSearch(inputValue)}
            disabled={disabled}
            isLoading={isLoading}
          />

          <div>
            {/* Render loading state if isLoading is true, otherwise render the left options */}
            {isLoading ? (
              <MultiSelectListLoading />
            ) : (
              <select
                multiple
                onChange={handleLeftSelect}
                disabled={disabled}
                className="w-full px-1 py-1.5 text-sm m-0 transition ease-in-out border border-gray-300 border-solid rounded-md focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none min-h-[10rem]"
              >
                {/* Render filtered left options */}
                {leftOptionsFiltered.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </InputsContainer>

        {/* Middle section with arrow icons */}
        <div className="min-h-max">
          <div className="flex items-center justify-center h-full ">
            <div className="space-x-6 sm:space-x-0 sm:space-y-2 sm:mt-16">
              {/* Icon for moving selected options from left to right */}
              <Icon
                icon={rightArrowIcon}
                className={classNames(
                  'px-3 py-3 text-lg text-white bg-gray-400 rounded-md md:text-2xl sm:px-4 sm:py-2 rotate-90 sm:rotate-0'
                  // Additional classes can be conditionally applied based on disabled state
                  // isRightArrowDisabled() ? "opacity-50 cursor-default" : "cursor-pointer",
                )}
                onClick={handleMoveLeft}
              />

              {/* Icon for moving selected options from right to left */}
              <Icon
                icon={leftArrowIcon}
                className={classNames(
                  'px-3 py-3 text-lg text-white bg-gray-400 rounded-md md:text-2xl sm:px-4 sm:py-2 rotate-90 sm:rotate-0'
                  // Additional classes can be conditionally applied based on disabled state
                  // isLeftArrowDisabled() ? "opacity-50 cursor-default" : "cursor-pointer",
                )}
                onClick={handleMoveRight}
              />
            </div>
          </div>
        </div>

        {/* Right side input container */}
        <InputsContainer>
          {/* Input field for right side search */}
          {moveUpDown ? (
            <div className="flex items-center justify-center">
              <div className="space-x-2">
                <Icon
                  icon={upArrowIcon}
                  className={classNames(
                    'px-2 py-1 text-lg text-white bg-gray-400 rounded-md md:text-2xl md:px-2 md:py-1'
                    // isRightArrowDisabled()
                    //     ? "opacity-50 cursor-default"
                    //     : "cursor-pointer",
                  )}
                  onClick={handleMoveUp}
                />

                <Icon
                  icon={downArrowIcon}
                  className={classNames(
                    'px-2 py-1 text-lg text-white bg-gray-400 rounded-md md:text-2xl md:px-2 md:py-1'
                    // isLeftArrowDisabled()
                    //     ? "opacity-50 cursor-default"
                    //     : "cursor-pointer",
                  )}
                  onClick={handleMoveDown}
                />
              </div>
            </div>
          ) : (
            <Input
              name="searchRight"
              value={rightSearch}
              onChange={(n, inputValue) => setRightSearch(inputValue)}
              disabled={disabled}
              isLoading={isLoading}
            />
          )}
          <div>
            {/* Render loading state if isLoading is true, otherwise render the right options */}
            {isLoading ? (
              <MultiSelectListLoading />
            ) : (
              <select
                multiple
                onChange={handleRightSelect}
                disabled={disabled}
                className="w-full px-1 py-1.5 text-sm m-0 transition ease-in-out border border-gray-300 border-solid rounded-md focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none min-h-[10rem]"
              >
                {/* Render filtered right options */}
                {rightOptionsFiltered.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </InputsContainer>
      </div>
      {/* Render error message if error is present */}
      {error && <p className="mt-1 text-xs text-red-500 md:text-sm">{error}</p>}
      {/* Render help text if provided */}
      {helpText && <p className="mt-1 text-xs text-gray-500 md:text-sm">{helpText}</p>}
    </div>
  )
}

export default MultiSelect
