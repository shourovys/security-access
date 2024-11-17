import { ftpApi, updateApi } from '../../../api/urls'
import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import FileInput from '../../../components/atomic/FileInput'
import Selector from '../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../types/components/common'
import {
  ICommandArrayResponse,
  IFormErrors,
  ISingleServerResponse,
} from '../../../types/pages/common'
import {
  IUpdateFormData,
  IUpdateServerFilesResult,
  maintenanceUpdateMediaOptions,
} from '../../../types/pages/maintenance'
import { updateIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import { IFtpResult } from '../../../types/pages/ftp'
import { useEffect, useState } from 'react'

interface IProps {
  formData: IUpdateFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function UpdateFrom({ formData, formErrors, handleInputChange, disabled, isLoading }: IProps) {
  const { isLoading: serverFilesLoading, data: serverFilesData } = useSWR<
    ICommandArrayResponse<string>
  >(
    formData.MediaType?.value === 'UserPC' || disabled || typeof handleInputChange === 'undefined'
      ? null
      : updateApi.fileOption(`MediaType=${formData.MediaType?.value}`)
  )

  const [mediaOptions, setMediaOptions] = useState([])

  const { data: ftpDetails, isLoading: ftpDetailsLoading } = useSWR<
    ISingleServerResponse<IFtpResult>
  >(ftpApi.details)

  useEffect(() => {
    if (ftpDetails) {
      setMediaOptions(
        maintenanceUpdateMediaOptions.filter((option) => {
          if (option.value === 'FTPServer') {
            return !!ftpDetails.data.Enable
          }
          return true
        }) as []
      )
    }
  }, [ftpDetailsLoading])

  return (
    <FormCardWithHeader icon={updateIcon} header={t`Update`}>
      <Selector
        name="MediaType"
        label={t`Media`}
        value={formData.MediaType}
        options={mediaOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading || ftpDetailsLoading}
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
    </FormCardWithHeader>
  )
}

export default UpdateFrom
