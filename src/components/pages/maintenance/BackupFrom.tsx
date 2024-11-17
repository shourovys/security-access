import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import RadioButtons from '../../../components/atomic/RadioButtons'
import Selector from '../../../components/atomic/Selector'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors, ISingleServerResponse } from '../../../types/pages/common'
import {
  IBackupFormData,
  maintenanceBackupMediaOptions,
  maintenanceBackupOptions,
} from '../../../types/pages/maintenance'
import { backupIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { IFtpResult } from '../../../types/pages/ftp'
import { ftpApi, networkApi } from '../../../api/urls'
import { INetworkResult } from '../../../types/pages/network'

interface IProps {
  formData: IBackupFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function BackupFrom({ formData, formErrors, handleInputChange, disabled, isLoading }: IProps) {
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
    <FormCardWithHeader icon={backupIcon} header={t`Backup`}>
      <Selector
        name="MediaType"
        label={t`Media`}
        value={formData.MediaType}
        options={mediaOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading || ftpDetailsLoading || networkDetailsLoading}
        error={formErrors?.MediaType}
      />
      <RadioButtons
        name="BackupType"
        inputLabel="Backup Data"
        checked={formData.BackupType}
        radios={maintenanceBackupOptions}
        onChange={handleInputChange}
        isLoading={isLoading}
        error={formErrors?.BackupType}
      />
    </FormCardWithHeader>
  )
}

export default BackupFrom
