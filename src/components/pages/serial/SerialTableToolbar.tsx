import { nodeApi } from '../../../api/urls'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import { INodeResult } from '../../../types/pages/node'
import { ISerialFilters } from '../../../types/pages/serial'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'

interface IProps {
  filterState: ISerialFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function SerialTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="id"
          placeholder={t`Serial No`}
          value={filterState.id}
          onChange={handleInputChange}
        />
        <Input
          name="name"
          placeholder={t`Serial Name`}
          value={filterState.name}
          onChange={handleInputChange}
        />
        <Selector
          name="node"
          placeholder={t`Node`}
          value={filterState.node}
          options={nodeData?.data.map((result) => ({
            value: result.NodeNo.toString(),
            label: result.NodeName,
          }))}
          onChange={handleInputChange}
          isLoading={nodeIsLoading}
        />
        <Input
          name="device"
          placeholder={t`Device`}
          value={filterState.device}
          onChange={handleInputChange}
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

export default SerialTableToolbar
