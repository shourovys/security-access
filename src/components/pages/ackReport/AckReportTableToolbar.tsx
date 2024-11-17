import DateInput from '../../../components/atomic/DateInput'
import { THandleDateChange, THandleFilterInputChange } from '../../../types/components/common'
import { IAckReportFilters } from '../../../types/pages/ackReport'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import t from '../../../utils/translator'

interface IProps {
  filterState: IAckReportFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function AckReportTableToolbar({
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
        {/* <input
                    id="event_time"
                    name="event_time"
                    value={filterState.event_time}
                    placeholder={t`ACK_Time`}
                    type="time"
                    onChange={e =>
                        handleInputChange
                            ? handleInputChange("event_time", e.target.value)
                            : null
                    }
                    className={classNames(
                        "form-control block w-full px-3 py-1.5 text-sm font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none disabled:bg-[#F0F1F3] disabled:text-gray-600",
                        !filterState.event_time &&
                            "before:content-['ACK_Time'] before:mr-4 before:text-gray-400",
                    )}
                /> */}
        {/* <Input
          name="ack_time"
          placeholder={t`ACK_Time`}
          type="time"
          value={filterState.ack_time}
          onChange={handleInputChange}
        /> */}
        <DateInput
          name="AckTime"
          placeholder={t`ACK Time`}
          value={{
            startDate: filterState.AckTime ? filterState.AckTime : null,
            endDate: filterState.AckTime ? filterState.AckTime : null,
          }}
          onChange={handleDateChange}
        />
        <Input
          name="AckUser"
          placeholder={t`ACK User`}
          value={filterState.AckUser}
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

export default AckReportTableToolbar
