import { AxiosError } from 'axios'
import useSWR from 'swr'
import { scheduleItemApi } from '../../../../../api/urls'
import { THandleInputChange, timeOptions } from '../../../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../../../../types/pages/common'
import {
  IScheduleItemFormData,
  ISunriseSunset,
  scheduleTimeTypeOptions,
} from '../../../../../types/pages/scheduleItem'
import { convert12to24 } from '../../../../../utils/formetTime'
import { timeIcon } from '../../../../../utils/icons'
import serverErrorHandler from '../../../../../utils/serverErrorHandler'
import t from '../../../../../utils/translator'
import FormCardWithHeader from '../../../../HOC/FormCardWithHeader'
import Input from '../../../../atomic/Input'
import InputWithOption from '../../../../atomic/InputWithOption'
import Selector, { TSelectValue } from '../../../../atomic/Selector'
import ScheduleItemMapForm from './ScheduleItemMapForm'

interface IProps {
  formData?: IScheduleItemFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IScheduleItemFormData>
  disabled?: boolean
  isLoading?: boolean
  setFormErrors?: (state: INewFormErrors<IScheduleItemFormData>) => void
}

function ScheduleItemTimeForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  setFormErrors,
}: IProps) {
  // Define the swr for get start and end time on latitude longitude change
  const { isLoading: timeLoading } = useSWR(
    !disabled &&
      typeof handleInputChange !== 'undefined' &&
      formData?.Latitude &&
      formData?.Latitude !== '0' &&
      formData.Longitude &&
      formData?.Longitude !== '0'
      ? scheduleItemApi.getTime(`latitude=${formData.Latitude}&longitude=${formData.Longitude}`)
      : null,
    {
      onSuccess: (data: ISunriseSunset) => {
        if (handleInputChange) {
          const sunrise = convert12to24(data.sunrise)
          const sunset = convert12to24(data.sunset)
          if (formData?.TimeType?.value === '1') {
            handleInputChange('StartTime', sunrise)
            handleInputChange('EndTime', sunset)
          } else if (formData?.TimeType?.value === '2') {
            handleInputChange('StartTime', sunset)
            handleInputChange('EndTime', sunrise)
          }
        }
      },
      onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
        serverErrorHandler(error, setFormErrors)
        if (handleInputChange) {
          handleInputChange('StartTime', '00:00')
          handleInputChange('EndTime', '00:00')
        }
      },
    }
    // setFormErrors(t`Start time, End time not get. Please try again.`)
  )

  const handleTimeTypeChange: (name: string, selectedValue: TSelectValue) => void = (
    name,
    selectedValue
  ) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('StartTime', '00:00')
      handleInputChange('EndTime', '00:00')
      handleInputChange('Latitude', '')
      handleInputChange('Longitude', '')
    }
  }

  return (
    <FormCardWithHeader icon={timeIcon} header={t`Time`} twoPart={false}>
      <div className="grid grid-cols-2 gap-y-3 gap-x-8 ">
        <Selector
          name="TimeType"
          label={t`Time Type`}
          value={formData?.TimeType}
          options={scheduleTimeTypeOptions}
          isClearable={false}
          onChange={handleTimeTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.TimeType}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-8 ">
        {formData?.TimeType?.value && (
          <InputWithOption
            name="StartTime"
            label={t`Start Time`}
            value={formData?.StartTime}
            onChange={handleInputChange}
            disabled={
              disabled ||
              typeof handleInputChange === 'undefined' ||
              formData?.TimeType?.value !== '0'
            }
            error={formErrors?.StartTime}
            isLoading={isLoading || timeLoading}
            required={formData?.TimeType?.value === '0'}
            options={timeOptions}
          />
        )}

        {formData?.TimeType?.value && (
          <InputWithOption
            name="EndTime"
            label={t`End Time`}
            value={formData?.EndTime}
            onChange={handleInputChange}
            disabled={
              disabled ||
              typeof handleInputChange === 'undefined' ||
              formData?.TimeType?.value !== '0'
            }
            error={formErrors?.EndTime}
            isLoading={isLoading || timeLoading}
            required={formData?.TimeType?.value === '0'}
            options={timeOptions}
          />
        )}
        {formData?.TimeType?.value && formData?.TimeType?.value !== '0' && (
          <Input
            name="Latitude"
            type="number"
            // placeholder={t`Enter Latitude for get times`}
            label={t`Latitude `}
            value={formData?.Latitude}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Latitude}
            isLoading={isLoading}
            required={true}
          />
        )}
        {formData?.TimeType?.value && formData?.TimeType?.value !== '0' && (
          <Input
            name="Longitude"
            type="number"
            // placeholder={t`Enter Longitude for get times`}
            label={t`Longitude `}
            value={formData?.Longitude}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Longitude}
            isLoading={isLoading}
            required={true}
          />
        )}
      </div>
      {formData?.TimeType?.value && formData?.TimeType?.value !== '0' && (
        <ScheduleItemMapForm
          Latitude={Number(formData?.Latitude)}
          Longitude={Number(formData?.Longitude)}
          handleInputChange={handleInputChange}
        />
      )}
    </FormCardWithHeader>
  )
}

export default ScheduleItemTimeForm
