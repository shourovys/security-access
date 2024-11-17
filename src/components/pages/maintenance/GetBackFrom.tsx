import { ftpApi, getBackApi, networkApi } from '../../../api/urls'
import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import FileInput from '../../../components/atomic/FileInput'
import SwitchButtonSelect from '../../../components/atomic/SelectSwitch'
import Selector from '../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../types/components/common'
import {
  ICommandArrayResponse,
  IFormErrors,
  ISingleServerResponse,
} from '../../../types/pages/common'
import {
  IGetBackFormData,
  IUpdateServerFilesResult,
  maintenanceBackupMediaOptions,
} from '../../../types/pages/maintenance'
import { getBackIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import { useEffect, useState } from 'react'
import { IFtpResult } from '../../../types/pages/ftp'
import { INetworkResult } from '../../../types/pages/network'
import { backupScheduleMediaOptions } from '../../../types/pages/backupSchedule'

interface IProps {
  formData: IGetBackFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function GetBackFrom({ formData, formErrors, handleInputChange, disabled, isLoading }: IProps) {
  const { isLoading: serverFilesLoading, data: serverFilesData } = useSWR<
    ICommandArrayResponse<string>
  >(
    formData.MediaType?.value === 'UserPC' || disabled || typeof handleInputChange === 'undefined'
      ? null
      : getBackApi.fileOption(`MediaType=${formData.MediaType?.value}`)
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
    <FormCardWithHeader icon={getBackIcon} header={t`GetBack`}>
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
      <SwitchButtonSelect
        name="DeleteExisting"
        label={t`Delete Existing Data`}
        value={formData.DeleteExisting}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default GetBackFrom
