import DateInput from '../../atomic/DateInput'
import { THandleDateChange, THandleFilterInputChange } from '../../../types/components/common'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import t from '../../../utils/translator'
import { IGuardReportFilters } from '../../../types/pages/guardReport'

interface IProps {
  filterState: IGuardReportFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function GuardReportTableToolbar({
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
          name="EventTime"
          placeholder={t`Event Time`}
          value={{
            startDate: filterState.EventTime ? filterState.EventTime : null,
            endDate: filterState.EventTime ? filterState.EventTime : null,
          }}
          onChange={handleDateChange}
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
        <Input
          name="CredentialNumb"
          type="number"
          placeholder={t`Credential Number`}
          value={filterState.CredentialNumb}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex gap-3.5  lg:gap-4">
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

export default GuardReportTableToolbar
