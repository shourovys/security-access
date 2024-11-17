import { THandleFilterInputChange } from '../../../types/components/common'
import {
  eventLevelsOptions,
  eventTypesOptions,
  IEventCodeFilters,
} from '../../../types/pages/eventCode'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector, { ISelectOption } from '../../atomic/Selector'
import t from '../../../utils/translator'
import useLicenseFilter from '../../../hooks/useLicenseFilter'

interface IProps {
  filterState: IEventCodeFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function EventCodeTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  const filteredEventTypesOptions = useLicenseFilter<ISelectOption>(eventTypesOptions, {
    '8': 'Camera',
    '9': 'Channel',
    '10': 'Channel',
    '11': 'Lockset',
    '12': 'Lockset',
    '13': 'Facegate',
    '14': 'Subnode',
    '15': 'ContLock',
    '16': 'ContLock',
    '17': 'ContLock',
    '18': 'Intercom',
  })
  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
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
          name="EventType"
          placeholder={t`Event Type`}
          value={filterState.EventType}
          options={filteredEventTypesOptions}
          isClearable
          onChange={handleInputChange}
        />
        <Selector
          name="EventLevel"
          placeholder={t`Event Level`}
          value={filterState.EventLevel}
          options={eventLevelsOptions}
          isClearable
          onChange={handleInputChange}
        />
      </div>

      <div className="flex gap-3.5 lg:gap-4 mb-1.5">
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

export default EventCodeTableToolbar
