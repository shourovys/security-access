import { THandleFilterInputChange } from '../../../types/components/common'
import { IDoorFilters } from '../../../types/pages/door'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'

import { nodeApi, partitionApi } from '../../../api/urls'
import useSWR from 'swr'

import { IListServerResponse } from '../../../types/pages/common'
import { INodeResult } from '../../../types/pages/node'
import { IPartitionResult } from '../../../types/pages/partition'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'
import useAuth from '../../../hooks/useAuth'
interface IProps {
  filterState: IDoorFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function DoorTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(partitionApi.list(SERVER_QUERY.selectorDataQuery))

  const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="DoorNo"
          placeholder={t`Door No`}
          value={filterState.DoorNo}
          onChange={handleInputChange}
        />
        <Input
          name="DoorName"
          placeholder={t`Door Name`}
          value={filterState.DoorName}
          onChange={handleInputChange}
        />
        {showPartition && (
          <Selector
            name="Partition"
            placeholder={t`Partition`}
            value={filterState.Partition}
            options={partitionData?.data.map((result) => ({
              value: result.PartitionNo.toString(),
              label: result.PartitionName,
            }))}
            isClearable
            onChange={handleInputChange}
            isLoading={partitionIsLoading}
          />
        )}
        <Selector
          name="Node"
          placeholder={t`Node`}
          value={filterState.Node}
          options={nodeData?.data.map((result) => ({
            value: result.NodeNo.toString(),
            label: result.NodeName,
          }))}
          isClearable
          onChange={handleInputChange}
          isLoading={nodeIsLoading}
        />
      </div>
      <div className="flex gap-3.5 lg:gap-4 justify-end md:justify-normal">
        <Button onClick={handleFilterApply}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button color="cancel" onClick={handleFilterStateReset}>
          <Icon icon={resetIcon} />
          <span>{t`Reset`}</span>
        </Button>
      </div>
    </TableToolbarContainer>
  )
}

export default DoorTableToolbar
