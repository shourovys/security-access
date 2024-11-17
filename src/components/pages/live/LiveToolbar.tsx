import { viewApi } from '../../../api/urls'
import useSWR from 'swr'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import { ILiveDashboardFilters, TCurrentSplit } from '../../../types/pages/live'
import { IViewResult } from '../../../types/pages/view'
import Icon, { fourBoxIcon, oneBoxIcon, twoBoxIcon } from '../../../utils/icons'
import { SERVER_QUERY } from '../../../utils/config'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'

interface IProps {
  handleSplits: (split: TCurrentSplit) => void
  filterState: ILiveDashboardFilters
  rowsPerPage: number
  handleInputChange: THandleFilterInputChange
  noData?: boolean
  channelLength?: number
}
function LiveToolbar({
  handleSplits,
  filterState,
  rowsPerPage,
  handleInputChange,
  noData,
  channelLength,
}: IProps) {
  const { isLoading: viewIsLoading, data: viewData } = useSWR<IListServerResponse<IViewResult[]>>(
    viewApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <div className="flex justify-between gap-2 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5 ">
      <div className="basis-1/4">
        <Selector
          name="View"
          placeholder={t`View`}
          value={filterState.View}
          options={viewData?.data.map((result) => ({
            value: result.ViewNo.toString(),
            label: result.ViewName,
          }))}
          onChange={handleInputChange}
          isLoading={viewIsLoading}
        />
      </div>

      <div className="flex gap-2 lg:gap-2 justify-items-end">
        <Button
          color={rowsPerPage === 1 ? 'primary' : 'danger'}
          disabled={noData}
          onClick={() => handleSplits(1)}
        >
          <Icon icon={oneBoxIcon} />
          <span>{t`1 X 1`}</span>
        </Button>
        <Button
          color={rowsPerPage === 2 ? 'primary' : 'danger'}
          disabled={noData || (!!channelLength && channelLength < 2)}
          onClick={() => handleSplits(2)}
        >
          <Icon icon={twoBoxIcon} />
          <span>{t`1 X 2`}</span>
        </Button>
        <Button
          color={rowsPerPage === 4 ? 'primary' : 'danger'}
          disabled={noData || (!!channelLength && channelLength < 3)}
          onClick={() => handleSplits(4)}
        >
          <Icon icon={fourBoxIcon} />
          <span>{t`2 X 2`}</span>
        </Button>
      </div>
    </div>
  )
}

export default LiveToolbar
