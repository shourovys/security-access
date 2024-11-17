import React from 'react'

interface IProps {
  // setSelectedHour: React.Dispatch<React.SetStateAction<string>>
  // setSelectedMinute: React.Dispatch<React.SetStateAction<string>>
  // selectedDateRecordedTimes: string[]
  selectedRecordedTime: string
  // setSelectedRecordedTime: React.Dispatch<React.SetStateAction<string>>
}

const RecordedTimeSelector: React.FC<IProps> = ({
  // setSelectedHour,
  // setSelectedMinute,
  // selectedDateRecordedTimes,
  selectedRecordedTime,
  // setSelectedRecordedTime,
}) => {
  // const [currentIndex, setCurrentIndex] = useState(0)

  // const handleNext = () => {
  //   const nextIndex = currentIndex === selectedDateRecordedTimes.length - 1 ? 0 : currentIndex + 1
  //   setCurrentIndex(nextIndex)
  //   setSelectedRecordedTime(selectedDateRecordedTimes[nextIndex])
  //   setSelectedHour(selectedDateRecordedTimes[nextIndex].slice(11, 13))
  //   setSelectedMinute(selectedDateRecordedTimes[nextIndex].slice(14, 16))
  // }

  // const handlePrevious = () => {
  //   const previousIndex =
  //     currentIndex === 0 ? selectedDateRecordedTimes.length - 1 : currentIndex - 1
  //   setCurrentIndex(previousIndex)
  //   setSelectedRecordedTime(selectedDateRecordedTimes[previousIndex])
  //   setSelectedHour(selectedDateRecordedTimes[previousIndex].slice(11, 13))
  //   setSelectedMinute(selectedDateRecordedTimes[previousIndex].slice(14, 16))
  // }

  // useEffect(() => {
  //   if (selectedRecordedTime) {
  //     const newIndex = selectedDateRecordedTimes.findIndex((time) => time === selectedRecordedTime)
  //     setCurrentIndex(newIndex)
  //   }
  // }, [selectedRecordedTime, selectedDateRecordedTimes])

  return (
    <div className="">
      {selectedRecordedTime && (
        <div className="flex items-center justify-between gap-4">
          {/* <Icon
            icon={leftArrowIcon}
            onClick={handlePrevious}
            className={classNames(
              'px-2 py-2 text-base text-white bg-gray-400 cursor-pointer hover:bg-gray-600 rounded-md md:text-xl sm:px-3 sm:py-2 '
            )}
          /> */}
          <span className="text-sm sm:text-base">{selectedRecordedTime}</span>
          {/* <Icon
            icon={rightArrowIcon}
            onClick={handleNext}
            className={classNames(
              'px-2 py-2 text-base text-white bg-gray-400 cursor-pointer hover:bg-gray-600 rounded-md md:text-xl sm:px-3 sm:py-2 '
            )}
          /> */}
        </div>
      )}
    </div>
  )
}

export default RecordedTimeSelector
