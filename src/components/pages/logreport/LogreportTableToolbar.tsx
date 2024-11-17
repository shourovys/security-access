import DateInput from '../../../components/atomic/DateInput'
import Selector from '../../../components/atomic/Selector'
import { THandleDateChange, THandleFilterInputChange } from '../../../types/components/common'
import { ILogReportFilters } from '../../../types/pages/logReport'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import t from '../../../utils/translator'
import useLicenseFilter from '../../../hooks/useLicenseFilter'
import { logDeviceTypeOptions } from '../../../types/pages/log'

interface IProps {
  filterState: ILogReportFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function LogReportTableToolbar({
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

  const filteredLogDeviceTypeOptions = useLicenseFilter(logDeviceTypeOptions, {
    '8': 'Camera',
    '9': 'Channel',
    '10': 'Channel',
    '11': 'Lockset',
    '12': 'Lockset',
    '13': 'Facegate',
    '14': 'Subnode',
    '15': 'Subnode',
    '16': 'ContLock',
    '17': 'ContLock',
    '18': 'Intercom',
  })

  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="LogNo"
          placeholder={t`Log No`}
          value={filterState.LogNo}
          onChange={handleInputChange}
        />
        <DateInput
          name="EventTime"
          placeholder={t`Event Time`}
          value={{
            startDate: filterState.EventTime ? filterState.EventTime : null,
            endDate: filterState.EventTime ? filterState.EventTime : null,
          }}
          onChange={handleDateChange}
        />
        <DateInput
          name="LogTime"
          placeholder={t`Log Time`}
          value={{
            startDate: filterState.LogTime ? filterState.LogTime : null,
            endDate: filterState.LogTime ? filterState.LogTime : null,
          }}
          onChange={handleDateChange}
        />
        <Input
          name="EventCode"
          placeholder={t`Event Code`}
          value={filterState.EventCode}
          onChange={handleInputChange}
        />
        <Input
          name="EventName"
          placeholder={t`Event Name`}
          value={filterState.EventName}
          onChange={handleInputChange}
        />
        <Selector
          name="DeviceType"
          placeholder={t`Device Type`}
          value={filterState.DeviceType}
          options={filteredLogDeviceTypeOptions}
          onChange={handleInputChange}
        />
        <Input
          name="DeviceNo"
          type="number"
          placeholder={t`Device No`}
          value={filterState.DeviceNo}
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

export default LogReportTableToolbar
