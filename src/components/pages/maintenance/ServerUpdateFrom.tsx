import { updateApi } from '../../../api/urls'
import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import useSWR from 'swr'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IUpdateServerResult } from '../../../types/pages/maintenance'
import { updateIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// interface IProps {
//   formData: IUpdateFormData
//   formErrors?: IFormErrors
//   handleInputChange?: THandleInputChange
//   disabled?: boolean
//   isLoading?: boolean
// }

function ServerUpdateFrom() {
  const { isLoading: serverUpdateDataLoading, data: serverUpdateData } = useSWR<
    ISingleServerResponse<IUpdateServerResult>
  >(updateApi.updateServer)

  return (
    <FormCardWithHeader icon={updateIcon} header={t`Update Server`}>
      <Input
        name="CurrentVersion"
        label={t`Current Version`}
        value={serverUpdateData?.data.CurrentVersion}
        disabled
        isLoading={serverUpdateDataLoading}
      />
      <Input
        name="LatestVersion"
        label={t`Latest Version`}
        value={serverUpdateData?.data.LatestVersion}
        disabled
        isLoading={serverUpdateDataLoading}
      />
    </FormCardWithHeader>
  )
}

export default ServerUpdateFrom
