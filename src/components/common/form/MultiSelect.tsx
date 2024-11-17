import classNames from 'classnames'
import { useEffect, useReducer } from 'react'
import InputsContainer from '../../../components/HOC/style/form/InputsContainer'
import Checkbox from '../../../components/atomic/Checkbox'
import Input from '../../../components/atomic/Input'
import MultiSelectListLoading from '../../../components/loading/form/MultiSelectListLoading'
import {
  MultiSelectOption,
  multiSelectInitialState,
  multiSelectReducer,
} from '../../../reducer/multiSelectReducer'
import { THandleInputSelect } from '../../../types/components/common'
import { ERROR_CLASS } from '../../../utils/config'
import Icon, { leftArrowIcon, rightArrowIcon } from '../../../utils/icons'
import CustomSelect from './CustomSelect'

// Define the MultiSelectProps interface
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
  verticalLayout?: boolean
  gridColSpan2?: boolean
  // Props for checkbox in label
  isSelected?: boolean
  handleSelect?: THandleInputSelect
  required?: boolean
}

// Define the MultiSelect component
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
  verticalLayout,
  gridColSpan2,
  isSelected,
  handleSelect,
  required,
}: MultiSelectProps) {
  // Use useReducer to manage component state
  const [multiSelectState, dispatch] = useReducer(multiSelectReducer, multiSelectInitialState)

  const {
    leftOptions,
    rightOptions,
    selectedLeftOptions,
    selectedRightOptions,
    leftSearch,
    rightSearch,
  } = multiSelectState

  // const optionsRef = useRef<MultiSelectOption[]>()
  // const valueRef = useRef<string[]>()

  // Update left and right options when the component receives new props
  useEffect(() => {
    if (value.length || options) {
      dispatch({
        type: 'SET_LEFT_OPTIONS',
        payload: options.filter((option) => !value.includes(option.id)),
      })
      dispatch({
        type: 'SET_RIGHT_OPTIONS',
        payload: options.filter((option) => value.includes(option.id)),
      })
    }
    // optionsRef.current = options
    // valueRef.current = value
  }, [value, options])

  // Handle selection in the left options list
  const handleLeftOptionSelect = (selected: string[]) => {
    dispatch({ type: 'SELECT_LEFT', payload: selected })
  }

  // Handle selection in the right options list
  const handleRightOptionSelect = (selected: string[]) => {
    dispatch({ type: 'SELECT_RIGHT', payload: selected })
  }

  // Update formData on right option change
  const updateFormData = (updatedOptions: MultiSelectOption[]) => {
    if (onChange) {
      onChange(
        name,
        updatedOptions.map((option) => option.id)
      )
    }
  }

  // Move selected options from left to right
  const moveLeftToRight = () => {
    if (disabled || leftOptions.length === 0) {
      return
    }

    const updatedRightOptions = [...rightOptions]
    const updatedLeftOptions = [...leftOptions]

    selectedLeftOptions.forEach((optionId) => {
      const selectedOptionIndex = updatedLeftOptions.findIndex((option) => option.id === optionId)
      if (selectedOptionIndex !== -1) {
        const selectedOption = updatedLeftOptions[selectedOptionIndex]
        updatedRightOptions.push(selectedOption)
        updatedLeftOptions.splice(selectedOptionIndex, 1)
      }
    })

    dispatch({ type: 'SET_RIGHT_OPTIONS', payload: updatedRightOptions })
    dispatch({ type: 'SET_LEFT_OPTIONS', payload: updatedLeftOptions })
    dispatch({ type: 'SELECT_LEFT', payload: [] })
    updateFormData(updatedRightOptions)
  }

  // Move selected options from right to left
  const moveRightToLeft = () => {
    if (disabled || rightOptions.length === 0) {
      return
    }

    const updatedRightOptions = [...rightOptions]
    const updatedLeftOptions = [...leftOptions]

    selectedRightOptions.forEach((optionId) => {
      const selectedOptionIndex = updatedRightOptions.findIndex((option) => option.id === optionId)
      if (selectedOptionIndex !== -1) {
        const selectedOption = updatedRightOptions[selectedOptionIndex]
        updatedLeftOptions.push(selectedOption)
        updatedRightOptions.splice(selectedOptionIndex, 1)
      }
    })

    dispatch({ type: 'SET_RIGHT_OPTIONS', payload: updatedRightOptions })
    dispatch({ type: 'SET_LEFT_OPTIONS', payload: updatedLeftOptions })
    dispatch({ type: 'SELECT_RIGHT', payload: [] })
    updateFormData(updatedRightOptions)
  }

  const handleLeftSearchInputChange = (value: string) => {
    dispatch({ type: 'SET_LEFT_SEARCH', payload: value })
  }

  const handleRightSearchInputChange = (value: string) => {
    dispatch({ type: 'SET_RIGHT_SEARCH', payload: value })
  }

  const renderLeftOptions = () => {
    if (isLoading) {
      return <MultiSelectListLoading />
    }

    return (
      <CustomSelect
        options={leftOptions}
        selectedOptions={selectedLeftOptions}
        onChange={handleLeftOptionSelect}
        disabled={disabled}
        isLoading={isLoading}
        search={leftSearch}
      />
    )
  }

  const renderRightOptions = () => {
    if (isLoading) {
      return <MultiSelectListLoading />
    }

    return (
      <CustomSelect
        options={rightOptions}
        selectedOptions={selectedRightOptions}
        onChange={handleRightOptionSelect}
        disabled={disabled}
        isLoading={isLoading}
        search={rightSearch}
      />
    )
  }

  return (
    <div className={classNames('w-full space-y-0.5' && gridColSpan2 && 'sm:col-span-2')}>
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
              {required && <span className="text-red-500">*</span>}
            </label>
          )}
        </>
      )}
      <div
        className={classNames(
          'flex gap-2',
          error && ERROR_CLASS,
          verticalLayout
            ? 'flex-col'
            : 'flex-wrap justify-center sm:justify-start sm:flex-nowrap sm:gap-6 md:gap-4 xl:gap-8'
        )}
      >
        {/* Left side input container */}
        <InputsContainer>
          {/* Input field for left side search */}
          <Input
            name="leftSearch"
            value={leftSearch}
            onChange={(inputName, inputValue) => handleLeftSearchInputChange(inputValue)}
            disabled={disabled}
            isLoading={isLoading}
          />
          <div>{renderLeftOptions()}</div>
        </InputsContainer>

        {/* Middle section with arrow icons */}
        <div className="min-h-max">
          <div className="flex items-center justify-center h-full">
            <div
              className={classNames(
                verticalLayout ? 'space-x-6' : 'space-x-6 sm:space-x-0 sm:space-y-2 sm:mt-16'
              )}
            >
              {/* Icon for moving selected options from left to right */}
              <Icon
                icon={rightArrowIcon}
                className={classNames(
                  'text-lg px-3 py-2 text-white bg-gray-400 cursor-pointer hover:bg-gray-600 rounded-md md:text-2xl rotate-90',
                  !verticalLayout && 'sm:px-4 sm:py-2 rotate-90 sm:rotate-0'
                )}
                onClick={moveLeftToRight}
              />

              {/* Icon for moving selected options from right to left */}
              <Icon
                icon={leftArrowIcon}
                className={classNames(
                  'text-lg px-3 py-2 text-white bg-gray-400 cursor-pointer hover:bg-gray-600 rounded-md md:text-2xl rotate-90',
                  !verticalLayout && 'sm:px-4 sm:py-2 rotate-90 sm:rotate-0'
                )}
                onClick={moveRightToLeft}
              />
            </div>
          </div>
        </div>

        {/* Right side input container */}
        <InputsContainer>
          {/* Input field for right side search */}
          <Input
            name="searchRight"
            value={rightSearch}
            onChange={(inputName, inputValue) => handleRightSearchInputChange(inputValue)}
            disabled={disabled}
            isLoading={isLoading}
          />
          <div>{renderRightOptions()}</div>
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
