import { contGateApi, partitionApi } from '../../../api/urls'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import { IContGateResult } from '../../../types/pages/contGate'
import { IContLockFilters } from '../../../types/pages/contLock'
import { IPartitionResult } from '../../../types/pages/partition'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'
import useAuth from '../../../hooks/useAuth'

interface IProps {
  filterState: IContLockFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function ContLockTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: contGateIsLoading, data: contGateData } = useSWR<
    IListServerResponse<IContGateResult[]>
  >(contGateApi.list(SERVER_QUERY.selectorDataQuery))

  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(partitionApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="ContLockNo"
          placeholder={t`ContLock No`}
          value={filterState.ContLockNo}
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
          name="ContLockName"
          placeholder={t`ContLock Name`}
          value={filterState.ContLockName}
          onChange={handleInputChange}
        />
        <Selector
          name="ContGate"
          placeholder={t`ContGate`}
          value={filterState.ContGate}
          options={contGateData?.data.map((result) => ({
            value: result.ContGateNo.toString(),
            label: result.ContGateName,
          }))}
          isClearable
          onChange={handleInputChange}
          isLoading={contGateIsLoading}
        />
        <Input
          name="RfAddress"
          placeholder={t`RF Address`}
          value={filterState.RfAddress}
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

export default ContLockTableToolbar
