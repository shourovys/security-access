import { partitionApi } from '../../../api/urls'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../types/components/common'
import { accessDeviceTypes, IAccessFilters } from '../../../types/pages/access'
import { IListServerResponse } from '../../../types/pages/common'
import { IPartitionResult } from '../../../types/pages/partition'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'
import useLicenseFilter from '../../../hooks/useLicenseFilter'
import useAuth from '../../../hooks/useAuth'

interface IProps {
  filterState: IAccessFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function AccessTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(partitionApi.list(SERVER_QUERY.selectorDataQuery))

  // const { isLoading: typeIsLoading, data: typeData } = useSWR<
  //     IListServerResponse<ITypeResult[]>
  // >(typeApi.list(SERVER_QUERY.selectorDataQuery));

  const filteredAccessDeviceTypes = useLicenseFilter(accessDeviceTypes, {
    '12': 'Lockset',
    '13': 'Facegate',
    '17': 'ContLock',
    '18': 'Intercom',
  })
  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="AccessNo"
          placeholder={t`Access No`}
          value={filterState.AccessNo}
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
          name="AccessName"
          value={filterState.AccessName}
          placeholder={t`Access Name`}
          onChange={handleInputChange}
        />
        <Selector
          name="DeviceType"
          placeholder={t`Access Type`}
          value={filterState.DeviceType}
          options={filteredAccessDeviceTypes}
          isClearable
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

export default AccessTableToolbar
