import useSWR from 'swr'
import { regionApi } from '../../../api/urls'
import { THandleDateChange, THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import { IRegionResult } from '../../../types/pages/region'
import { IOccupancyReportFilters } from '../../../types/pages/occupancyReport'
import { SERVER_QUERY } from '../../../utils/config'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import DateInput from '../../atomic/DateInput'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import DateTimeInput from '../../atomic/DateTimeInput'

interface IProps {
  filterState: IOccupancyReportFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function OccupancyReportTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const handleDateChange: THandleDateChange = (name, value) => {
    if (handleInputChange) {
      handleInputChange(name, value?.startDate)
    }
  }

  const { isLoading: regionIsLoading, data: regionData } = useSWR<
    IListServerResponse<IRegionResult[]>
  >(regionApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Selector
          name="Region"
          placeholder={t`Region`}
          value={filterState.Region}
          options={regionData?.data.map((result) => ({
            value: result.RegionNo.toString(),
            label: result.RegionName,
          }))}
          isClearable
          onChange={handleInputChange}
          isLoading={regionIsLoading}
        />
        <Input
          name="FirstName"
          placeholder={t`First Name`}
          value={filterState.FirstName}
          onChange={handleInputChange}
        />
        <Input
          name="LastName"
          placeholder={t`Last Name`}
          value={filterState.LastName}
          onChange={handleInputChange}
        />
        <DateTimeInput
          name="ResetTime"
          placeholder={t`Reset Time`}
          value={filterState.ResetTime}
          onChange={handleInputChange}
          format="yyyy-MM-dd HH:mm"
          required={true}
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

export default OccupancyReportTableToolbar
