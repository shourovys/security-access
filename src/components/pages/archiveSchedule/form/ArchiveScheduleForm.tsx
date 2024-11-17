import { ftpApi, networkApi, scheduleApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import {
  IArchiveScheduleFormData,
  IArchiveScheduleInfoFormData,
  archiveScheduleMediaOptions,
} from '../../../../types/pages/archiveSchedule'
import {
  IFormErrors,
  IListServerResponse,
  ISingleServerResponse,
} from '../../../../types/pages/common'
import { IScheduleResult } from '../../../../types/pages/schedule'
import { SERVER_QUERY } from '../../../../utils/config'
import { archiveScheduleIcon } from '../../../../utils/icons'
import { formatDateTimeTzView, formatDateTimeView } from '../../../../utils/formetTime'
import t from '../../../../utils/translator'
import { useEffect, useState } from 'react'
import { IFtpResult } from '../../../../types/pages/ftp'
import { INetworkResult } from '../../../../types/pages/network'
import { maintenanceBackupMediaOptions } from '../../../../types/pages/maintenance'

interface IProps {
  formData?: IArchiveScheduleFormData | IArchiveScheduleInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function ArchiveScheduleForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const { isLoading: scheduleIsLoading, data: scheduleData } = useSWR<
    IListServerResponse<IScheduleResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : scheduleApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const [mediaOptions, setMediaOptions] = useState([])
  const { data: ftpDetails, isLoading: ftpDetailsLoading } = useSWR<
    ISingleServerResponse<IFtpResult>
  >(ftpApi.details)
  const { data: networkDetails, isLoading: networkDetailsLoading } = useSWR<
    ISingleServerResponse<INetworkResult>
  >(networkApi.details)

  useEffect(() => {
    if (ftpDetails && networkDetails) {
      setMediaOptions(
        archiveScheduleMediaOptions.filter((option) => {
          if (option.value === '2') {
            return !!ftpDetails.data.Enable
          } else if (option.value === '3') {
            return !!networkDetails.data.Cloud
          }
          return true
        }) as []
      )
    }
  }, [ftpDetailsLoading, networkDetailsLoading])

  return (
    <FormCardWithHeader icon={archiveScheduleIcon} header={t`Archive Schedule`}>
      <Input
        name="ArchiveName"
        // placeholder="Archive Schedule Form"
        label={t`Archive Schedule Name `}
        value={formData?.ArchiveName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ArchiveName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="ArchiveDesc"
        // placeholder="Description"
        label={t`Description`}
        value={formData?.ArchiveDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ArchiveDesc}
        isLoading={isLoading}
      />

      <Selector
        name="Media"
        label={t`Media`}
        value={formData?.Media}
        options={mediaOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Media}
        isLoading={isLoading}
      />

      <SwitchButtonSelect
        name="UsageBased"
        label={t`Usage Based`}
        value={formData?.UsageBased}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.UsageBased?.value === '0' ? (
        <Selector
          name="Schedule"
          label={t`Schedule`}
          value={formData?.Schedule}
          options={scheduleData?.data.map((result) => ({
            value: result.ScheduleNo.toString(),
            label: result.ScheduleName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Schedule}
          isLoading={isLoading || scheduleIsLoading}
        />
      ) : (
        <Input
          name="UsagePercent"
          // placeholder="Usage Percent"
          label={t`Usage Percent `}
          type="number"
          value={formData?.UsagePercent}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.UsagePercent}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}

      {(disabled || typeof handleInputChange === 'undefined') &&
        formData &&
        'ArchiveTime' in formData && (
          <Input
            name="ArchiveTime"
            label={t`Archive Time`}
            value={formData?.ArchiveTime == 0 ? '' : formatDateTimeTzView(formData?.ArchiveTime)}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.ArchiveTime}
            isLoading={isLoading}
          />
        )}

      {(disabled || typeof handleInputChange === 'undefined') &&
        formData &&
        'ArchiveLogNo' in formData && (
          <Input
            name="ArchiveLogNo"
            label={t`Archive Logo No`}
            value={formData?.ArchiveLogNo}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading}
          />
        )}
    </FormCardWithHeader>
  )
}

export default ArchiveScheduleForm
