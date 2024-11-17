import { doorApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { ICredentialScanFormData } from '../../../../types/pages/credential'
import { IDoorResult } from '../../../../types/pages/door'
import { SERVER_QUERY } from '../../../../utils/config'
import { credentialIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: ICredentialScanFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
  modelTitle?: string
}

function CredentialScanForm({
  formData,
  handleInputChange,
  formErrors,
  isLoading,
  modelTitle = t`Credential Scan`,
}: IProps) {
  const { isLoading: doorIsLoading, data: doorData } = useSWR<IListServerResponse<IDoorResult[]>>(
    doorApi.list(SERVER_QUERY.selectorDataQuery)
  )
  return (
    <FormCardWithHeader icon={credentialIcon} header={modelTitle}>
      <Selector
        name="Door"
        label={t`Door`}
        value={formData.Door}
        options={doorData?.data.map((result) => ({
          value: result.DoorNo.toString(),
          label: result.DoorName,
        }))}
        onChange={handleInputChange}
        error={formErrors?.Door}
        isLoading={doorIsLoading}
      />
      <Input
        name="Status"
        label={t`Status`}
        value={formData.Status}
        onChange={handleInputChange}
        disabled={true}
        error={formErrors?.Status}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default CredentialScanForm
