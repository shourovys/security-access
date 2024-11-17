import { backupApi, ftpApi, networkApi } from '../../../api/urls'
import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import FileInput from '../../../components/atomic/FileInput'
import RadioButtons from '../../../components/atomic/RadioButtons'
import Selector from '../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../types/components/common'
import {
  ICommandArrayResponse,
  ICommandResponse,
  IFormErrors,
  ISingleServerResponse,
} from '../../../types/pages/common'
import {
  IRestoreFormData,
  IUpdateServerFilesResult,
  maintenanceBackupMediaOptions,
  maintenanceBackupOptions,
} from '../../../types/pages/maintenance'
import { restoreIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import { useEffect, useState } from 'react'
import { IFtpResult } from '../../../types/pages/ftp'
import { INetworkResult } from '../../../types/pages/network'
import { backupScheduleMediaOptions } from '../../../types/pages/backupSchedule'

interface IProps {
  formData: IRestoreFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function RestoreFrom({ formData, formErrors, handleInputChange, disabled, isLoading }: IProps) {
  const { isLoading: serverFilesLoading, data: serverFilesData } = useSWR<
    ICommandArrayResponse<string>
  >(
    formData.MediaType?.value === 'UserPC' || disabled || typeof handleInputChange === 'undefined'
      ? null
      : backupApi.fileOption(`MediaType=${formData.MediaType?.value}`)
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
        maintenanceBackupMediaOptions.filter((option) => {
          if (option.value === 'FTPServer') {
            return !!ftpDetails.data.Enable
          } else if (option.value === 'CloudServer') {
            return !!networkDetails.data.Cloud
          }
          return true
        }) as []
      )
    }
  }, [ftpDetailsLoading, networkDetailsLoading])

  return (
    <FormCardWithHeader icon={restoreIcon} header={t`Restore`}>
      <Selector
        name="MediaType"
        label={t`Media`}
        value={formData.MediaType}
        options={mediaOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        error={formErrors?.MediaType}
      />

      <div>
        {formData.MediaType?.value === 'UserPC' ? (
          <FileInput
            name="File"
            label={t`File `}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading}
            error={formErrors?.File}
            required={true} // modified by Imran
          />
        ) : (
          <Selector
            name="FileName"
            label={t`File Name`}
            value={formData.FileName}
            options={serverFilesData?.cgi.data.map((option) => ({
              label: option,
              value: option,
            }))}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || serverFilesLoading}
            error={formErrors?.FileName}
          />
        )}
      </div>
      <RadioButtons
        name="BackupType"
        inputLabel={t`Backup Data`}
        checked={formData.BackupType}
        radios={maintenanceBackupOptions}
        onChange={handleInputChange}
        isLoading={isLoading}
        error={formErrors?.BackupType}
      />
    </FormCardWithHeader>
  )
}

export default RestoreFrom
