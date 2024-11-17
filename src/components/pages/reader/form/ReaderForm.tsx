import { nodeApi, subnodeApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { INodeResult } from '../../../../types/pages/node'
import { IReaderFormData, IReaderInfoFormData } from '../../../../types/pages/reader'
import { ISubnodeResult } from '../../../../types/pages/subnode'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IReaderFormData | IReaderInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function ReaderForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )
  const { isLoading: subnodeIsLoading, data: subnodeData } = useSWR<
    IListServerResponse<ISubnodeResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : subnodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Reader`}>
      <Input
        name="ReaderName"
        label={t`Reader Name`}
        value={formData?.ReaderName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ReaderName}
        isLoading={isLoading}
      />
      <Input
        name="ReaderDesc"
        label={t`Description`}
        value={formData?.ReaderDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ReaderDesc}
        isLoading={isLoading}
      />
      {(disabled || typeof handleInputChange === 'undefined') &&
        formData &&
        'ReaderPort' in formData && (
          <Selector
            name="Node"
            label={t`Node`}
            value={formData?.Node}
            options={nodeData?.data.map((result) => ({
              value: result.NodeNo.toString(),
              label: result.NodeName,
            }))}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Node}
            isLoading={isLoading || nodeIsLoading}
          />
        )}
      {(disabled || typeof handleInputChange === 'undefined') &&
        formData &&
        'ReaderPort' in formData && (
          <Selector
            name="Subnode"
            label={t`Subnode`}
            value={formData?.Subnode}
            options={subnodeData?.data.map((result) => ({
              value: result.SubnodeNo.toString(),
              label: result.SubnodeName,
            }))}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Subnode}
            isLoading={isLoading || subnodeIsLoading}
          />
        )}
      {(disabled || typeof handleInputChange === 'undefined') &&
        formData &&
        'ReaderPort' in formData && (
          <Input
            name="ReaderPort"
            label={t`Reader Port`}
            value={formData?.ReaderPort}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.ReaderPort}
            isLoading={isLoading}
          />
        )}
    </FormCardWithHeader>
  )
}

export default ReaderForm
