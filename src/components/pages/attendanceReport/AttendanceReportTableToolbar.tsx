import DateInput from '../../atomic/DateInput'
import { THandleDateChange, THandleFilterInputChange } from '../../../types/components/common'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import { IAttendanceReportFilters } from '../../../types/pages/attendanceReport'

interface IProps {
  filterState: IAttendanceReportFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function AttendanceReportTableToolbar({
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

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <DateInput
          name="InTime"
          placeholder={t`Date`}
          value={{
            startDate: filterState.InTime ? filterState.InTime : null,
            endDate: filterState.InTime ? filterState.InTime : null,
          }}
          onChange={handleDateChange}
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

export default AttendanceReportTableToolbar
