export interface MultiSelectOption {
  id: string
  label: string
}

export interface MultiSelectState {
  leftOptions: MultiSelectOption[]
  rightOptions: MultiSelectOption[]
  selectedLeftOptions: string[]
  selectedRightOptions: string[]
  leftSearch: string
  rightSearch: string
}

export type MultiSelectAction =
  | { type: 'SET_LEFT_OPTIONS'; payload: MultiSelectOption[] }
  | { type: 'SET_RIGHT_OPTIONS'; payload: MultiSelectOption[] }
  | { type: 'SELECT_LEFT'; payload: string[] }
  | { type: 'SELECT_RIGHT'; payload: string[] }
  | { type: 'SET_LEFT_SEARCH'; payload: string }
  | { type: 'SET_RIGHT_SEARCH'; payload: string }

export const multiSelectInitialState: MultiSelectState = {
  leftOptions: [],
  rightOptions: [],
  selectedLeftOptions: [],
  selectedRightOptions: [],
  leftSearch: '',
  rightSearch: '',
}

export function multiSelectReducer(
  state: MultiSelectState,
  action: MultiSelectAction
): MultiSelectState {
  switch (action.type) {
    case 'SET_LEFT_OPTIONS':
      return { ...state, leftOptions: action.payload }
    case 'SET_RIGHT_OPTIONS':
      return { ...state, rightOptions: action.payload }
    case 'SELECT_LEFT':
      return { ...state, selectedLeftOptions: action.payload }
    case 'SELECT_RIGHT':
      return { ...state, selectedRightOptions: action.payload }
    case 'SET_LEFT_SEARCH':
      return { ...state, leftSearch: action.payload }
    case 'SET_RIGHT_SEARCH':
      return { ...state, rightSearch: action.payload }
    default:
      return state
  }
}

export function multiSelectOptionMove(
  state: MultiSelectState,
  direction: number
): MultiSelectState {
  const { selectedRightOptions } = state

  // Check if there are selected options on the right side
  if (!selectedRightOptions.length) {
    // If no selected options, return the original state as there's nothing to move
    return state
  }

  // Create a copy of the rightOptions array from the state
  const updatedRightOptions = [...state.rightOptions]

  // Filter the rightOptions to get the selected options to be moved
  const selectedOptions = updatedRightOptions.filter((option) =>
    selectedRightOptions.includes(option.id)
  )

  // If there are no selected options, return the original state
  if (selectedOptions.length === 0) {
    return state
  }

  // Extract the IDs of the selected options
  const selectedOptionIds = selectedOptions.map((option) => option.id)

  // Filter the rightOptions to get the remaining options (not selected)
  const sortedOptions = updatedRightOptions.filter(
    (option) => !selectedOptionIds.includes(option.id)
  )

  // Find the index of the first selected option in updatedRightOptions
  const startIndex = updatedRightOptions.findIndex((option) =>
    selectedOptionIds.includes(option.id)
  )

  // Calculate the new index after moving (direction can be positive or negative)
  let newIndex = startIndex + direction

  // Ensure newIndex is within bounds
  if (newIndex < 0) {
    newIndex = 0 // Move to the beginning
  } else if (newIndex > sortedOptions.length) {
    newIndex = sortedOptions.length // Move to the end
  }

  // Insert the selected options at the new index in sortedOptions
  sortedOptions.splice(newIndex, 0, ...selectedOptions)

  // Create a new state object with updated rightOptions and return it
  return {
    ...state,
    rightOptions: sortedOptions,
  }
}
