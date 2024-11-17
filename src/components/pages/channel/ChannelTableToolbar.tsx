import Icon, { applyIcon, resetIcon } from '../../../utils/icons'

import { nvrApi, partitionApi } from '../../../api/urls'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IChannelFilters } from '../../../types/pages/channel'
import { IListServerResponse } from '../../../types/pages/common'
import { INvrResult } from '../../../types/pages/nvr'
import { IPartitionResult } from '../../../types/pages/partition'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'
import useAuth from '../../../hooks/useAuth'

interface IProps {
  filterState: IChannelFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function ChannelTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(partitionApi.list(SERVER_QUERY.selectorDataQuery))

  const { isLoading: nvrIsLoading, data: nvrData } = useSWR<IListServerResponse<INvrResult[]>>(
    nvrApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="ChannelNo"
          placeholder={t`Channel No`}
          value={filterState.ChannelNo}
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
          name="ChannelName"
          placeholder={t`Channel Name`}
          value={filterState.ChannelName}
          onChange={handleInputChange}
        />
        <Selector
          name="Nvr"
          placeholder={t`Nvr`}
          value={filterState.Nvr}
          options={nvrData?.data.map((result) => ({
            value: result.NvrNo.toString(),
            label: result.NvrName,
          }))}
          isClearable
          onChange={handleInputChange}
          isLoading={nvrIsLoading}
        />
        <Input
          name="ChannelId"
          placeholder={t`Channel ID`}
          value={filterState.ChannelId}
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

export default ChannelTableToolbar
