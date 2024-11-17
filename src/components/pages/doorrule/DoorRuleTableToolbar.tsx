import useSWR from 'swr'
import { doorApi, partitionApi } from '../../../api/urls'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import { IDoorResult } from '../../../types/pages/door'
import { IDoorRuleFilters, doorRuleTypeOption } from '../../../types/pages/doorRule'
import { IPartitionResult } from '../../../types/pages/partition'
import { SERVER_QUERY } from '../../../utils/config'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import useAuth from '../../../hooks/useAuth'
interface IProps {
  filterState: IDoorRuleFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function DoorRuleTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(partitionApi.list(SERVER_QUERY.selectorDataQuery))

  const { isLoading: doorIsLoading, data: doorData } = useSWR<IListServerResponse<IDoorResult[]>>(
    doorApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="RuleNo"
          placeholder={t`Rule No`}
          value={filterState.RuleNo}
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
        <Input
          name="RuleName"
          placeholder={t`Rule Name`}
          value={filterState.RuleName}
          onChange={handleInputChange}
        />
        <Selector
          name="RuleType"
          placeholder={t`Rule Type`}
          value={filterState.RuleType}
          options={doorRuleTypeOption}
          isClearable
          onChange={handleInputChange}
        />
        {/* <Selector
          name="Door"
          placeholder={t`Door`}
          value={filterState.Door}
          options={doorData?.data.map((result) => ({
            value: result.DoorNo.toString(),
            label: result.DoorName,
          }))}
          isClearable
          onChange={handleInputChange}
          isLoading={doorIsLoading}
        /> */}
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

export default DoorRuleTableToolbar
