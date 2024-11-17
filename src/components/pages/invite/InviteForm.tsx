import useSWR from 'swr'
import { formatApi } from '../../../api/urls'
import { THandleInputChange } from '../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../types/pages/common'
import { IFormatResult } from '../../../types/pages/format'
import { IInviteFormData } from '../../../types/pages/invite'
import { SERVER_QUERY } from '../../../utils/config'
import { inviteIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import FormCardWithHeader from '../../HOC/FormCardWithHeader'
import Input from '../../atomic/Input'
import SwitchButtonSelect from '../../atomic/SelectSwitch'
import Selector from '../../atomic/Selector'

interface IProps {
  formData?: IInviteFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IInviteFormData>
  disabled?: boolean
  isLoading?: boolean
}

function InviteForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: formatIsLoading, data: formatData } = useSWR<
    IListServerResponse<IFormatResult[]>
  >(formatApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <FormCardWithHeader icon={inviteIcon} header={t`Invite`}>
      <>
        <SwitchButtonSelect
          name="Enable"
          label={t`Enable`}
          value={formData?.Enable}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
        {formData?.Enable?.value === '1' && (
          <>
            <Selector
              name="Format"
              label={t`Format`}
              value={formData.Format}
              options={formatData?.data.map((result) => ({
                value: result.FormatNo.toString(),
                label: result.FormatName,
              }))}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.Format}
              isLoading={formatIsLoading}
              required={true}
            />
            <Input
              name="MaxTime"
              label={t`Max Time`}
              type="number"
              value={formData?.MaxTime}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.MaxTime}
              isLoading={isLoading}
              required={true}
            />
            <Input
              name="MaxCount"
              label={t`Max Count`}
              type="number"
              value={formData?.MaxCount}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.MaxCount}
              isLoading={isLoading}
            />
            <SwitchButtonSelect
              name="InviteAccess"
              label={t`Invite Access`}
              value={formData?.InviteAccess}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading}
            />
          </>
        )}
      </>
    </FormCardWithHeader>
  )
}

export default InviteForm
