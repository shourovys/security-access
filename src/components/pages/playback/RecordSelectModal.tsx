import React from 'react'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IPlaybackFilters } from '../../../types/pages/playback'
import Icon, { applyIcon, cancelIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import FormActionButtonsContainer from '../../HOC/style/form/FormActionButtonsContainer'
import Button from '../../atomic/Button'
import CameraTimeSelector from './CameraTimeSelector'
import RecordGoToModal from './RecordGoToModal'
import SelectRecordedTime from './SelectRecordedTime'

interface IProps {
  selectedHour: string
  setSelectedHour: React.Dispatch<React.SetStateAction<string>>
  selectedMinute: string
  setSelectedMinute: React.Dispatch<React.SetStateAction<string>>
  filterState: IPlaybackFilters
  handleInputChange: THandleFilterInputChange
  recordedDates?: string[]
  selectedDateRecordedTimes?: string[]
  handleReloadData: () => void
  isLoading: boolean
  // selectedRecordedTime: string
  // setSelectedRecordedTime: React.Dispatch<React.SetStateAction<string>>
  handleApply: () => void
  handleModalClose: () => void
}

function RecordSelectModal({
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
  filterState,
  handleInputChange,
  recordedDates,
  selectedDateRecordedTimes,
  handleReloadData,
  isLoading,
  // selectedRecordedTime,
  // setSelectedRecordedTime,
  handleApply,
  handleModalClose,
}: IProps) {
  return (
    <div className="w-full p-4 bg-white rounded-md space-y-6 mb-2">
      <RecordGoToModal
        isLoading={isLoading}
        filterState={filterState}
        handleInputChange={handleInputChange}
      />
      {filterState.NvrType === 0 && (
        <>
          <SelectRecordedTime
            selectedHour={selectedHour}
            setSelectedHour={setSelectedHour}
            selectedMinute={selectedMinute}
            setSelectedMinute={setSelectedMinute}
            filterState={filterState}
            handleInputChange={handleInputChange}
            recordedDates={recordedDates}
            selectedDateRecordedTimes={selectedDateRecordedTimes}
            handleReloadData={handleReloadData}
            isLoading={isLoading}
          />
          <div className="hidden md:block pt-2">
            <CameraTimeSelector
              selectedHour={selectedHour}
              setSelectedHour={setSelectedHour}
              selectedMinute={selectedMinute}
              setSelectedMinute={setSelectedMinute}
              selectedDateRecordedTimes={selectedDateRecordedTimes}
              handleInputChange={handleInputChange}
              // selectedRecordedTime={filterStateRef.current.SelectedRecordedTime}
              // setSelectedRecordedTime={setSelectedRecordedTime}
            />
          </div>
        </>
      )}
      <FormActionButtonsContainer allowsShow padding={false}>
        <Button color="apply" size="large" onClick={handleApply}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" onClick={handleModalClose}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer>
    </div>
  )
}

export default RecordSelectModal
