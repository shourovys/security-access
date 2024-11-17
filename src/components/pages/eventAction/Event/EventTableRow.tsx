// @ts-nocheck
import TableData from '../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../components/HOC/style/table/TableRow'
import Checkbox from '../../../../components/atomic/Checkbox'
import routeProperty from '../../../../routes/routeProperty'
import { IEventResult, eventActionEventTypesObject } from '../../../../types/pages/eventAndAction'

type IProps = {
  row: IEventResult
  selected: string[]
  handleSelectRow: (selectedId: string) => void
  eventActionId: string
}

function EventTableRow({ row, selected, handleSelectRow, eventActionId }: IProps) {
  return (
    <TableRow
      key={row.EventNo}
      link={routeProperty.eventInfo.path(eventActionId, row.EventNo)}
      selected={selected.indexOf(row.EventNo.toString() ?? '') !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.EventNo.toString() ?? '') !== -1}>
        <Checkbox
          value={`select-row-${row.EventNo}`}
          checked={selected.indexOf(row.EventNo.toString() ?? '') !== -1}
          onChange={() => {
            handleSelectRow(row.EventNo.toString() ?? '')
          }}
        />
      </TableDataAction>
      <TableData>{row.EventNo}</TableData>
      <TableData>{eventActionEventTypesObject[row.EventType]}</TableData>
      <TableData>{row.EventWhats.map((event) => event.EventCodes.EventName).join(', ')}</TableData>
      <TableData>{row.EventItems?.map((event) => event?.Items?.Name).join(', ')}</TableData>
    </TableRow>
  )
}

export default EventTableRow
