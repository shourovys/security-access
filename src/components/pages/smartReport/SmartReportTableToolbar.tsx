import { THandleFilterInputChange } from '../../../types/components/common'
import { ISmartReportFilters } from '../../../types/pages/SmartReport'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import DateTimeInput from '../../atomic/DateTimeInput'
import Input from '../../atomic/Input'
import DeviceListFilterForm from './DeviceListFilterForm'
import EventListFilterForm from './EventListFilterForm'
import OutputListFilterForm from './OutputListFilterForm'
import PersonListFilterForm from './PersonListFilterForm'

interface IProps {
  filterState: ISmartReportFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function SmartReportTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <DateTimeInput
          name="StartTime"
          placeholder={t`Start Time`}
          value={filterState.StartTime}
          onChange={handleInputChange}
          format="yyyy-MM-dd HH:mm"
          required={true}
        />
        <DateTimeInput
          name="EndTime"
          placeholder={t`End Time`}
          value={filterState.EndTime}
          onChange={handleInputChange}
          format="yyyy-MM-dd HH:mm"
          required={true}
        />
        <Input
          name="EventName"
          placeholder={t`Event Name`}
          value={filterState.EventName}
          onChange={handleInputChange}
        />
        <Input
          name="DeviceName"
          placeholder={t`Device Name`}
          value={filterState.DeviceName}
          onChange={handleInputChange}
        />
        <Input
          name="PersonName"
          placeholder={t`Person Name`}
          value={filterState.PersonName}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <EventListFilterForm filterState={filterState} handleInputChange={handleInputChange} />
        <DeviceListFilterForm filterState={filterState} handleInputChange={handleInputChange} />
        <PersonListFilterForm filterState={filterState} handleInputChange={handleInputChange} />
        <OutputListFilterForm filterState={filterState} handleInputChange={handleInputChange} />
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

export default SmartReportTableToolbar
