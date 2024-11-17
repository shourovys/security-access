import TableData from '../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../components/HOC/style/table/TableRow'
import Checkbox from '../../../../components/atomic/Checkbox'
import routeProperty from '../../../../routes/routeProperty'
import {
  IScheduleItemResult,
  scheduleTimeTypeObject,
  scheduleTypeObject,
  scheduleWeekdaysObject,
} from '../../../../types/pages/scheduleItem'
import { binaryToIndex } from '../../../../utils/indexToBinary'

type IProps = {
  row: IScheduleItemResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
  scheduleId: string
}

function ScheduleItemTableRow({ row, selected, handleSelectRow, scheduleId }: IProps) {
  return (
    <TableRow
      key={row.ItemNo}
      link={routeProperty.scheduleItemInfo.path(scheduleId, row.ItemNo)}
      selected={selected.indexOf(row.ItemNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.ItemNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.ItemNo}`}
          checked={selected.indexOf(row.ItemNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.ItemNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{scheduleTypeObject[row.ScheduleType]}</TableData>
      <TableData>
        {row.ScheduleType === 1
          ? binaryToIndex(row.Weekdays)
              .map((value) => scheduleWeekdaysObject[value])
              .join(', ')
          : row.ScheduleType === 2
          ? row.Monthday
          : row.OneDate}
      </TableData>
      <TableData>{scheduleTimeTypeObject[row.TimeType]}</TableData>
      <TableData>{row.StartTime}</TableData>
      <TableData>{row.EndTime}</TableData>
      {/* <TableData>{row.Latitude}</TableData>
      <TableData>{row.Longitude}</TableData> */}
    </TableRow>
  )
}

export default ScheduleItemTableRow
