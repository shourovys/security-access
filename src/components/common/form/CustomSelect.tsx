import React from 'react'

interface Option {
  id: string
  label: string
}

interface SelectProps {
  options: Option[]
  selectedOptions: string[]
  onChange: (selectedOptions: string[]) => void
  disabled?: boolean
  isLoading?: boolean
  search: string
}

const CustomSelect: React.FC<SelectProps> = ({
  options,
  selectedOptions,
  onChange,
  disabled,
  isLoading,
  search,
}) => {
  // const [isDragging, setIsDragging] = useState(false)
  // const [selectedOnDrag, setSelectedOnDrag] = useState<string[]>([])
  // const containerRef = useRef<HTMLDivElement | null>(null)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleOptionSelect = (optionId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      // Check if the Ctrl key is pressed
      const ctrlKeyIsPressed = event.ctrlKey

      // Convert the selectedOptions to a Set to remove duplicates
      const selectedSet = new Set(selectedOptions)

      // Toggle the selection based on Ctrl key press
      if (ctrlKeyIsPressed) {
        if (selectedSet.has(optionId)) {
          selectedSet.delete(optionId)
        } else {
          selectedSet.add(optionId)
        }
      } else {
        // If Ctrl is not pressed, clear the selected options
        selectedSet.clear()
        selectedSet.add(optionId)
      }

      // Convert the Set back to an array
      const updatedSelectedOptions = Array.from(selectedSet)

      onChange(updatedSelectedOptions)
    }
  }

  // const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   if (!disabled && !isLoading) {
  //     // Check if the Ctrl key is pressed
  //     const ctrlKeyIsPressed = event.ctrlKey

  //     // Only set selectedOnDrag if Ctrl key is not pressed
  //     if (!ctrlKeyIsPressed) {
  //       setIsDragging(true)
  //       setSelectedOnDrag([event.currentTarget.value])
  //     }
  //   }
  // }

  // const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   if (isDragging && containerRef.current) {
  //     const buttons = containerRef.current.querySelectorAll('button:not([disabled])')
  //     const startIndex = Array.from(buttons).indexOf(event.currentTarget as HTMLButtonElement)
  //     const endIndex = Array.from(buttons).indexOf(document.activeElement as HTMLButtonElement)
  //     const minIndex = Math.min(startIndex, endIndex)
  //     const maxIndex = Math.max(startIndex, endIndex)
  //     const selectedIds = Array.from(buttons)
  //       .slice(minIndex, maxIndex + 1)
  //       .map((button) => (button as HTMLButtonElement).value)

  //     setSelectedOnDrag(selectedIds)
  //   }
  // }

  // const handleMouseUp = () => {
  //   setIsDragging(false)
  //   setSelectedOnDrag([])
  // }

  // useEffect(() => {
  //   if (isDragging) {
  //     onChange([...selectedOptions, ...selectedOnDrag])
  //   }
  // }, [isDragging, selectedOnDrag, selectedOptions, onChange])

  return (
    <>
      <div
        // ref={containerRef}
        className="w-full transition-all overflow-y-auto custom_transition border border-gray-300 border-solid rounded-md focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none h-[10rem] md:hidden"
      >
        <ul className="">
          {filteredOptions.map((option) => (
            <li key={option.id} className="relative group ">
              <button
                type="button"
                value={option.id}
                onClick={(e) => handleOptionSelect(option.id, e)}
                // onMouseDown={handleMouseDown}
                // onMouseEnter={handleMouseEnter}
                // onMouseUp={handleMouseUp}
                disabled={disabled || isLoading}
                className={`${
                  selectedOptions.includes(option.id)
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700'
                } group flex items-center px-2 py-1 text-sm font-medium focus:outline-none w-full`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <select
        multiple
        onChange={(e) => onChange(Array.from(e.target.selectedOptions).map((o) => o.value))}
        disabled={disabled}
        className="w-full px-1 py-1.5 text-sm m-0 transition ease-in-out border border-gray-300 border-solid rounded-md focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none min-h-[10rem] hidden md:block"
      >
        {filteredOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

export default CustomSelect
