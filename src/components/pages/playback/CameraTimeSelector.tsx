import classNames from 'classnames'
import React, { useEffect } from 'react'
import { THandleFilterInputChange } from '../../../types/components/common'
import createArray from '../../../utils/createArray'

interface Props {
  selectedHour: string
  setSelectedHour: React.Dispatch<React.SetStateAction<string>>
  selectedMinute: string
  setSelectedMinute: React.Dispatch<React.SetStateAction<string>>
  selectedDateRecordedTimes?: string[] // Example: [ "2021-07-01 12:00:00", "2021-07-01 12:01:00" ]
  handleInputChange: THandleFilterInputChange
  // selectedRecordedTime: string
  // setSelectedRecordedTime: React.Dispatch<React.SetStateAction<string>>
}

const CameraTimeSelector: React.FC<Props> = ({
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
  selectedDateRecordedTimes = [],
  handleInputChange,
  // setSelectedRecordedTime,
}) => {
  // When the selectedDateRecordedTimes prop changes, update the selectedHour and selectedMinute state to match the hour and minute of the first recorded time.
  useEffect(() => {
    const firstRecordedTime = selectedDateRecordedTimes[0]
    setSelectedHour(firstRecordedTime ? firstRecordedTime.slice(11, 13) : '')
    setSelectedMinute(firstRecordedTime ? firstRecordedTime.slice(14, 16) : '')
  }, [selectedDateRecordedTimes])

  // When the selectedHour state changes or the selectedDateRecordedTimes prop changes, update the selectedRecordedTime with the first recorded time that matches the selected hour and minute.
  useEffect(() => {
    const firstRecordedTime = selectedDateRecordedTimes.find(
      (recordedTime) =>
        recordedTime.slice(11, 13) === selectedHour && recordedTime.slice(14, 16) === selectedMinute
    )
    handleInputChange('SelectedRecordedTime', firstRecordedTime || '')
  }, [selectedDateRecordedTimes, selectedHour, selectedMinute])

  // Function to check if a given hour has recorded times in the data
  const isRecordedHour = (hour: string): boolean => {
    const hourString = hour.padStart(2, '0')
    return selectedDateRecordedTimes.some(
      (recordedTime) => recordedTime.slice(11, 13) === hourString
    )
  }

  // Function to check if a given minute has recorded times in the data
  const isRecordedMinute = (minute: string): boolean => {
    const minuteString = minute.padStart(2, '0')
    const timeString = `${selectedHour.padStart(2, '0')}:${minuteString}:00`
    return selectedDateRecordedTimes.some((recordedTime) => recordedTime.includes(timeString))
  }

  // Function to handle hour selection
  const handleHourSelection = (hour: string): void => {
    setSelectedHour(hour)
  }

  // Function to handle minute selection
  const handleMinuteSelection = (minute: string): void => {
    setSelectedMinute(minute)
    const minuteString = minute.padStart(2, '0')
    const timeString = `${selectedHour.padStart(2, '0')}:${minuteString}:00`
    const recordedTime = selectedDateRecordedTimes.find((_recordedTime) =>
      _recordedTime.includes(timeString)
    )

    if (recordedTime) {
      handleInputChange('SelectedRecordedTime', recordedTime)
      // setSelectedRecordedTime(recordedTime)
    } else {
      handleInputChange('SelectedRecordedTime', '')
      // setSelectedRecordedTime('')
    }
  }

  // Function to render hour selection buttons
  const renderHourButtons = (): JSX.Element[] => {
    return createArray(24).map((hour, index) => {
      const hourString = (hour - 1).toString().padStart(2, '0')
      const isSelected = selectedHour === hourString
      const isRecorded = isRecordedHour(hourString)

      const buttonClasses = classNames(
        'w-[4.166666666666667%]',
        isSelected
          ? 'border-[3px] border-red-500'
          : `border border-black ${index !== 0 && 'border-l-0'}`,
        isRecorded && 'bg-green-700 text-white'
      )

      return (
        <button
          key={hour}
          className={buttonClasses}
          onClick={() => handleHourSelection(hourString)}
          disabled={!isRecorded}
        >
          {hourString}
        </button>
      )
    })
  }

  // Function to render minute selection buttons
  const renderMinuteButtons = (): JSX.Element[] => {
    return createArray(12).map((index) => {
      const minute = index * 5 - 5
      const minuteString = minute.toString().padStart(2, '0')
      const isRecorded = isRecordedMinute(minuteString)

      const buttonClasses = classNames(
        'w-[20%] cursor-normal text-xs',
        isRecorded && 'bg-green-700 text-white'
      )

      // const isSelectedBlock = [0, 1, 2, 3, 4].find((subLine) => {
      //   const subLineMinute = minute + subLine
      //   const subLineMinuteString = subLineMinute.toString().padStart(2, '0')
      //   return isRecordedMinute(subLineMinuteString)
      // })

      return (
        <div
          key={minute}
          className={classNames(
            'w-full'
            // isSelectedBlock && 'border-separate border-2 border-red-500'
          )}
        >
          <div className="flex w-full border border-b-0 border-black">
            <button className={classNames(buttonClasses)} disabled={!isRecorded}>
              {minuteString}
            </button>
            <div className="flex w-full">
              {[1, 2, 3, 4].map((subLine) => {
                const subLineMinute = minute + subLine
                const subLineMinuteString = subLineMinute.toString().padStart(2, '0')
                const isSubLineRecorded = isRecordedMinute(subLineMinuteString)
                const subLineClasses = classNames(
                  'w-[25%] h-full',
                  isSubLineRecorded && `bg-green-700`
                )

                return <div key={subLine} className={classNames(subLineClasses)}></div>
              })}
            </div>
          </div>
          <div className="flex w-full border border-black min-w-max">
            {[0, 1, 2, 3, 4].map((subLine) => {
              const subLineMinute = minute + subLine
              const subLineMinuteString = subLineMinute.toString().padStart(2, '0')
              const isSubLineRecorded = isRecordedMinute(subLineMinuteString)

              return (
                <div
                  key={subLine}
                  className={classNames(
                    'w-[20%] h-6',
                    subLine !== 4 && 'border-black',
                    isSubLineRecorded && 'bg-green-700 cursor-pointer',
                    selectedMinute === subLineMinuteString
                      ? 'border-separate border-2 border-red-500'
                      : subLine !== 4 && 'border-r'
                  )}
                  onClick={() => handleMinuteSelection(subLineMinuteString)}
                  title={findRecordedTimeByMinute(subLineMinuteString)}
                ></div>
              )
            })}
          </div>
        </div>
      )
    })
  }

  // Function to find the recorded time based on the selected minute
  const findRecordedTimeByMinute = (minute: string): string => {
    const minuteString = minute.padStart(2, '0')
    const timeString = `${selectedHour.padStart(2, '0')}:${minuteString}:00`
    const recordedTime = selectedDateRecordedTimes.find((_recordedTime) =>
      _recordedTime.includes(timeString)
    )

    return recordedTime || ''
  }

  // Return the JSX for rendering the camera time selector
  return (
    <div className="overflow-x-auto">
      <div className="mx-auto w-[850px] md:w-full space-y-4">
        <div className="hour-selector">
          <div className="">{renderHourButtons()}</div>
        </div>
        <div className="minute-selector">
          <div className="minute-row">
            <div className="flex">{renderMinuteButtons()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraTimeSelector
