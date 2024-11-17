import { ftpApi, networkApi, scheduleApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import RadioButtons from '../../../../components/atomic/RadioButtons'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import {
  backupScheduleMediaOptions,
  IBackupScheduleFormData,
  IBackupScheduleInfoFormData,
  maintenanceBackupScheduleOptions,
} from '../../../../types/pages/backupSchedule'
import {
  IFormErrors,
  IListServerResponse,
  ISingleServerResponse,
} from '../../../../types/pages/common'
import { IScheduleResult } from '../../../../types/pages/schedule'
import { SERVER_QUERY } from '../../../../utils/config'
import { backupScheduleIcon } from '../../../../utils/icons'
import { formatDateTimeTzView, formatDateTimeView } from '../../../../utils/formetTime'
import t from '../../../../utils/translator'
import { IFtpResult } from '../../../../types/pages/ftp'
import { INetworkResult } from '../../../../types/pages/network'
import { useEffect, useState } from 'react'
import { maintenanceBackupMediaOptions } from '../../../../types/pages/maintenance'

interface IProps {
  formData?: IBackupScheduleFormData | IBackupScheduleInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function BackupScheduleForm({
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
        backupScheduleMediaOptions.filter((option) => {
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
    <FormCardWithHeader icon={backupScheduleIcon} header={t`Backup Schedule`}>
      <Input
        name="BackupName"
        // placeholder="Backup Name"
        label={t`Backup Name `}
        value={formData?.BackupName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.BackupName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="BackupDesc"
        // placeholder="Description"
        label={t`Description`}
        value={formData?.BackupDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.BackupDesc}
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
        isLoading={isLoading || ftpDetailsLoading || networkDetailsLoading}
      />

      <RadioButtons
        name="BackupData"
        inputLabel="Backup Data"
        checked={formData?.BackupData}
        radios={maintenanceBackupScheduleOptions}
        onChange={handleInputChange}
        isLoading={isLoading}
        error={formErrors?.BackupData}
      />

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

      <div>
        {(disabled || typeof handleInputChange === 'undefined') &&
          formData &&
          'BackupTime' in formData && (
            <Input
              name="BackupTime"
              label={t`Backup Time`}
              value={formData?.BackupTime == 0 ? '' : formatDateTimeTzView(formData?.BackupTime)}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.BackupTime}
              isLoading={isLoading}
            />
          )}
      </div>
    </FormCardWithHeader>
  )
}

export default BackupScheduleForm
