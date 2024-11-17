import { nodeApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorAddFormData } from '../../../../types/pages/door'
import { INodeResult } from '../../../../types/pages/node'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData: IDoorAddFormData
  handleInputChange?: THandleInputChange
  formErrors: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function DoorAddForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(partitionApi.list(SERVER_QUERY.selectorDataQuery))

  const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Door Add`}>
      {showPartition && (
        <Selector
          name="Partition"
          label={t`Partition`}
          value={formData.Partition}
          options={partitionData?.data.map((result) => ({
            value: result.PartitionNo.toString(),
            label: result.PartitionName,
          }))}
          onChange={handleInputChange}
          isLoading={isLoading || partitionIsLoading}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors.Partition}
        />
      )}
      <Input
        name="DoorName"
        label={t`Door Name `}
        value={formData.DoorName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors.DoorName}
        required={true} // modified by Imran
      />
      <Input
        name="DoorDesc"
        label={t`Description`}
        value={formData.DoorDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors.DoorDesc}
      />
      <Selector
        name="Node"
        label={t`Node`}
        value={formData.Node}
        options={nodeData?.data.map((result) => ({
          value: result.NodeNo.toString(),
          label: result.NodeName,
        }))}
        onChange={handleInputChange}
        isLoading={isLoading || nodeIsLoading}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors.Node}
      />
      <Input
        name="DoorPort"
        label={t`Door Port`}
        type="number"
        value={formData.DoorPort}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors.DoorPort}
      />
    </FormCardWithHeader>
  )
}

export default DoorAddForm
