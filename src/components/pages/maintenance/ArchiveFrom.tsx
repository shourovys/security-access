import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import Selector from '../../../components/atomic/Selector'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors, ISingleServerResponse } from '../../../types/pages/common'
import { IArchiveFormData, maintenanceBackupMediaOptions } from '../../../types/pages/maintenance'
import { archiveIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { IFtpResult } from '../../../types/pages/ftp'
import { ftpApi, networkApi } from '../../../api/urls'
import { INetworkResult } from '../../../types/pages/network'

interface IProps {
  formData: IArchiveFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function ArchiveFrom({ formData, formErrors, handleInputChange, disabled, isLoading }: IProps) {
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
    <FormCardWithHeader icon={archiveIcon} header={t`Archive`}>
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
      <Input
        name="LogNo"
        // placeholder="Archive Log No"
        label={t`Archive Log No `}
        type="number"
        value={formData?.LogNo}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.LogNo}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
    </FormCardWithHeader>
  )
}

export default ArchiveFrom
