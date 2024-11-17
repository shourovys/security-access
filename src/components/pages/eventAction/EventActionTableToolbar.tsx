import { partitionApi } from '../../../api/urls'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import { IEventActionFilters } from '../../../types/pages/eventAction'
import { IPartitionResult } from '../../../types/pages/partition'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'

interface IProps {
  filterState: IEventActionFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function EventActionTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(partitionApi.list(SERVER_QUERY.selectorDataQuery))
  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="EventActionNo"
          placeholder={t`Event Action No`}
          value={filterState.EventActionNo}
          onChange={handleInputChange}
        />
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
        <Input
          name="EventActionName"
          placeholder={t`Event Action Name`}
          value={filterState.EventActionName}
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

export default EventActionTableToolbar
