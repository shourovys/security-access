import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import useClock from '../../../hooks/useClock'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { ITimeFormData } from '../../../types/pages/time'
import { formatDateTimeView } from '../../../utils/formetTime'
import t from '../../../utils/translator'
import Input from '../../atomic/Input'

dayjs.extend(utc)

interface IProps {
  formData?: ITimeFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function TimeInfoForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { currentTime } = useClock({
    Timezone: formData?.Timezone?.value || '',
    CurrentTime: formData?.CurrentTime || '',
  })

  // const currentTimeDayjs = dayjs.unix(currentTime).utc(false).format('YYYY-MM-DDTHH:mm')

  return (
    <Input
      name="CurrentTime"
      label={t`Current Time`}
      value={currentTime ? formatDateTimeView(currentTime) : '--'}
      onChange={handleInputChange}
      disabled={disabled || typeof handleInputChange === 'undefined'}
      error={formErrors?.CurrentTime}
      isLoading={isLoading}
      format="yyyy-MM-dd HH:mm"
    />
  )
}

export default TimeInfoForm
