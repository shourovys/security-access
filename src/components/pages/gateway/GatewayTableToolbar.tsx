import { nodeApi } from '../../../api/urls'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import { IGatewayFilters } from '../../../types/pages/gateway'
import { INodeResult } from '../../../types/pages/node'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'

interface IProps {
  filterState: IGatewayFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function GatewayTableToolbar({
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
          name="GatewayNo"
          placeholder={t`Gateway No`}
          value={filterState.GatewayNo}
          onChange={handleInputChange}
          type="number"
        />
        <Input
          name="GatewayName"
          placeholder={t`Gateway Name`}
          value={filterState.GatewayName}
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
        <Input
          name="IpAddress"
          placeholder={t`IP Address`}
          value={filterState.IpAddress}
          onChange={handleInputChange}
          type="number"
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

export default GatewayTableToolbar
