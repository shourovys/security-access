// import classNames from 'classnames'
// import { useEffect, useReducer } from 'react'
// import useAuth from '../../../hooks/useAuth'
// import {
//   MultiSelectOption,
//   multiSelectInitialState,
//   multiSelectOptionMove,
//   multiSelectReducer,
// } from '../../../reducer/multiSelectReducer'
// import { IFormErrors } from '../../../types/pages/common'
// import { IFavoriteFormData } from '../../../types/pages/favorite'
// import { ERROR_CLASS } from '../../../utils/config'
// import Icon, {
//   downArrowIcon,
//   favoriteIcon,
//   leftArrowIcon,
//   rightArrowIcon,
//   upArrowIcon,
// } from '../../../utils/icons'
// import t from '../../../utils/translator'
// import FormCardWithHeader from '../../HOC/FormCardWithHeader'
// import InputsContainer from '../../HOC/style/form/InputsContainer'
// import Input from '../../atomic/Input'
// import MultiSelectListLoading from '../../loading/form/MultiSelectListLoading'

// // Interface for component props
// interface IProps {
//   formData?: IFavoriteFormData
//   handleInputChange: (name: string, value: MultiSelectOption[]) => void
//   formErrors?: IFormErrors
//   disabled?: boolean
//   isLoading?: boolean
// }

// function FavoriteForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
//   const { permissions } = useAuth()

//   // Constants for better readability
//   const inputName = 'favoritePages'
//   const inputLabel = t`Favorite Page`

//   // Extract the selected options from formData or set to an empty array
//   const rightOptions = formData?.favoritePages || []

//   // Define the onChange function to handle input changes
//   const handleFormInputChange = handleInputChange

//   // Filter permissions based on access and transform them into the desired format
//   const availableOptions = permissions
//     .filter((permission) => permission.access)
//     .map((item) => ({
//       id: item.id.toString(),
//       label: item.name,
//     }))

//   const formError = formErrors?.favoritePages

//   // Use useReducer to manage the state of the MultiSelect component
//   const [multiSelectState, dispatch] = useReducer(multiSelectReducer, multiSelectInitialState)

//   const { leftOptions, selectedLeftOptions, selectedRightOptions, leftSearch, rightSearch } =
//     multiSelectState

//   // Update left and right options based on props changes or initial load
//   useEffect(() => {
//     dispatch({
//       type: 'SET_LEFT_OPTIONS',
//       payload: availableOptions.filter((option) => !rightOptions.some((i) => i.id === option.id)),
//     })
//     dispatch({
//       type: 'SET_RIGHT_OPTIONS',
//       payload: availableOptions.filter((option) => rightOptions.some((i) => i.id === option.id)),
//     })
//   }, [formData?.favoritePages])

//   // Handle selection in the left options list
//   const handleLeftOptionSelect = (selected: string[]) => {
//     dispatch({ type: 'SELECT_LEFT', payload: selected })
//   }

//   // Handle selection in the right options list
//   const handleRightOptionSelect = (selected: string[]) => {
//     dispatch({ type: 'SELECT_RIGHT', payload: selected })
//   }

//   // Update formData with the new selected options
//   const updateFormData = (updatedOptions: MultiSelectOption[]) => {
//     if (handleFormInputChange) {
//       handleFormInputChange(inputName, updatedOptions)
//     }
//   }

//   // Move selected options from left to right
//   const moveLeftToRight = () => {
//     if (disabled || leftOptions.length === 0) {
//       return
//     }

//     const updatedRightOptions = [...rightOptions]
//     const updatedLeftOptions = [...leftOptions]

//     selectedLeftOptions.forEach((optionId) => {
//       const selectedOptionIndex = updatedLeftOptions.findIndex((option) => option.id === optionId)
//       if (selectedOptionIndex !== -1) {
//         const selectedOption = updatedLeftOptions[selectedOptionIndex]
//         updatedRightOptions.push(selectedOption)
//         updatedLeftOptions.splice(selectedOptionIndex, 1)
//       }
//     })

//     handleFormInputChange(inputName, updatedRightOptions)
//     dispatch({ type: 'SET_RIGHT_OPTIONS', payload: updatedRightOptions })
//     dispatch({ type: 'SET_LEFT_OPTIONS', payload: updatedLeftOptions })
//     dispatch({ type: 'SELECT_LEFT', payload: [] })
//     updateFormData(updatedRightOptions)
//   }

//   // Move selected options from right to left
//   const moveRightToLeft = () => {
//     if (disabled || rightOptions.length === 0) {
//       return
//     }

//     const updatedRightOptions = [...rightOptions]
//     const updatedLeftOptions = [...leftOptions]

//     selectedRightOptions.forEach((optionId) => {
//       const selectedOptionIndex = updatedRightOptions.findIndex((option) => option.id === optionId)
//       if (selectedOptionIndex !== -1) {
//         const selectedOption = updatedRightOptions[selectedOptionIndex]
//         updatedLeftOptions.push(selectedOption)
//         updatedRightOptions.splice(selectedOptionIndex, 1)
//       }
//     })

//     handleFormInputChange(inputName, updatedRightOptions)
//     dispatch({ type: 'SET_RIGHT_OPTIONS', payload: updatedRightOptions })
//     dispatch({ type: 'SET_LEFT_OPTIONS', payload: updatedLeftOptions })
//     dispatch({ type: 'SELECT_RIGHT', payload: [] })
//     updateFormData(updatedRightOptions)
//   }

//   // Move selected options up
//   const moveRightOptionsUp = () => {
//     if (disabled || selectedRightOptions.length === 0) {
//       return
//     }

//     const updatedState = multiSelectOptionMove(
//       { ...multiSelectState, rightOptions: rightOptions },
//       -1
//     )

//     dispatch({ type: 'SET_RIGHT_OPTIONS', payload: updatedState.rightOptions })
//     handleFormInputChange(inputName, updatedState.rightOptions)
//   }

//   // Move selected options down
//   const moveRightOptionsDown = () => {
//     if (disabled || selectedRightOptions.length === 0) {
//       return
//     }

//     const updatedState = multiSelectOptionMove(
//       { ...multiSelectState, rightOptions: rightOptions },
//       1
//     )

//     dispatch({ type: 'SET_RIGHT_OPTIONS', payload: updatedState.rightOptions })
//     handleFormInputChange(inputName, updatedState.rightOptions)
//   }

//   // Handle left search input change
//   const handleLeftSearchInputChange = (value: string) => {
//     dispatch({ type: 'SET_LEFT_SEARCH', payload: value })
//   }

//   // Render the left options
//   const renderLeftOptions = () => {
//     const filteredLeftOptions = leftOptions.filter((option) =>
//       option.label.toLowerCase().includes(leftSearch.toLowerCase())
//     )

//     if (isLoading) {
//       return <MultiSelectListLoading />
//     }

//     return (
//       <select
//         multiple
//         onChange={(e) =>
//           handleLeftOptionSelect(Array.from(e.target.selectedOptions).map((o) => o.value))
//         }
//         disabled={disabled}
//         className="w-full px-1 py-1.5 text-sm m-0 transition ease-in-out border border-gray-300 border-solid rounded-md focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none min-h-[10rem]"
//       >
//         {filteredLeftOptions.map((option) => (
//           <option key={option.id} value={option.id}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     )
//   }

//   // Render the right options
//   const renderRightOptions = () => {
//     const filteredRightOptions = rightOptions.filter((option) =>
//       option.label.toLowerCase().includes(rightSearch.toLowerCase())
//     )

//     if (isLoading) {
//       return <MultiSelectListLoading />
//     }

//     return (
//       <select
//         multiple
//         onChange={(e) =>
//           handleRightOptionSelect(Array.from(e.target.selectedOptions).map((o) => o.value))
//         }
//         disabled={disabled}
//         className="w-full px-1 py-1.5 text-sm m-0 transition ease-in-out border border-gray-300 border-solid rounded-md focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none min-h-[10rem]"
//       >
//         {filteredRightOptions.map((option) => (
//           <option key={option.id} value={option.id}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     )
//   }

//   return (
//     <FormCardWithHeader icon={favoriteIcon} header={t`Favorite`} twoPart={false}>
//       <div className="w-full space-y-0.5">
//         <label className="inline-block w-full text-sm text-gray-700 form-label" htmlFor={inputName}>
//           {inputLabel}
//         </label>
//         <div
//           className={classNames(
//             'flex flex-wrap justify-center gap-4 sm:justify-start sm:flex-nowrap sm:gap-6 md:gap-4 xl:gap-8',
//             formError && ERROR_CLASS
//           )}
//         >
//           <InputsContainer>
//             <Input
//               name="leftSearch"
//               value={leftSearch}
//               onChange={(inputName, inputValue) => handleLeftSearchInputChange(inputValue)}
//               disabled={disabled}
//               isLoading={isLoading}
//             />
//             <div>{renderLeftOptions()}</div>
//           </InputsContainer>
//           <div className="min-h-max">
//             <div className="flex items-center justify-center h-full">
//               <div className="space-x-6 sm:space-x-0 sm:space-y-2 sm:mt-16">
//                 <Icon
//                   icon={rightArrowIcon}
//                   className={classNames(
//                     'px-3 py-3 text-lg text-white bg-gray-400 cursor-pointer hover:bg-gray-600 rounded-md md:text-2xl sm:px-4 sm:py-2 rotate-90 sm:rotate-0'
//                   )}
//                   onClick={moveLeftToRight}
//                 />
//                 <Icon
//                   icon={leftArrowIcon}
//                   className={classNames(
//                     'px-3 py-3 text-lg text-white bg-gray-400 cursor-pointer hover:bg-gray-600 rounded-md md:text-2xl sm:px-4 sm:py-2 rotate-90 sm:rotate-0'
//                   )}
//                   onClick={moveRightToLeft}
//                 />
//               </div>
//             </div>
//           </div>
//           <InputsContainer>
//             <div className="flex items-center justify-center gap-4 md:gap-2">
//               <Icon
//                 icon={upArrowIcon}
//                 className={classNames(
//                   'px-2.5 py-1.5 text-base text-white bg-gray-400 rounded-md md:text-lg md:px-3 md:py-2 cursor-pointer hover:bg-gray-600'
//                 )}
//                 onClick={moveRightOptionsUp}
//               />
//               <Icon
//                 icon={downArrowIcon}
//                 className={classNames(
//                   'px-2.5 py-1.5 text-base text-white bg-gray-400 rounded-md md:text-lg md:px-3 md:py-2 cursor-pointer hover:bg-gray-600'
//                 )}
//                 onClick={moveRightOptionsDown}
//               />
//             </div>
//             <div>{renderRightOptions()}</div>
//           </InputsContainer>
//         </div>
//         {formError && <p className="mt-1 text-xs text-red-500 md:text-sm">{formError}</p>}
//       </div>
//     </FormCardWithHeader>
//   )
// }

// export default FavoriteForm
