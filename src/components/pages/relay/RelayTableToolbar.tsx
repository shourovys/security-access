import { elevatorApi, nodeApi, partitionApi } from '../../../api/urls'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import { IElevatorResult } from '../../../types/pages/elevator'
import { INodeResult } from '../../../types/pages/node'
import { IPartitionResult } from '../../../types/pages/partition'
import { IRelayFilters } from '../../../types/pages/relay'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'
import useAuth from '../../../hooks/useAuth'

interface IProps {
  filterState: IRelayFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function RelayTableToolbar({
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

  const { isLoading: elevatorIsLoading, data: elevatorData } = useSWR<
    IListServerResponse<IElevatorResult[]>
  >(elevatorApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="RelayNo"
          placeholder={t`Relay No`}
          value={filterState.RelayNo}
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
            onChange={handleInputChange}
            isLoading={partitionIsLoading}
          />
        )}
        <Input
          name="RelayName"
          placeholder={t`Relay Name`}
          value={filterState.RelayName}
          onChange={handleInputChange}
        />
        <Selector
          name="Node"
          placeholder={t`Node`}
          value={filterState.Node}
          options={nodeData?.data.map((result) => ({
            value: result.NodeNo.toString(),
            label: result.NodeName,
          }))}
          onChange={handleInputChange}
          isLoading={nodeIsLoading}
        />
        <Selector
          name="Elevator"
          placeholder={t`Elevator`}
          value={filterState.Elevator}
          options={elevatorData?.data.map((result) => ({
            value: result.ElevatorNo.toString(),
            label: result.ElevatorName,
          }))}
          onChange={handleInputChange}
          isLoading={elevatorIsLoading}
        />
      </div>
      <div className="flex gap-3.5 lg:gap-4">
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

export default RelayTableToolbar
