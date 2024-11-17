import TableData from '../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../components/HOC/style/table/TableRow'
import Checkbox from '../../../../components/atomic/Checkbox'
import routeProperty from '../../../../routes/routeProperty'
import { IHolidayItemResult } from '../../../../types/pages/holidayItem'
import { formatDateView } from '../../../../utils/formetTime'

type IProps = {
  row: IHolidayItemResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
  holidayId: string
}

function HolidayItemTableRow({ row, selected, handleSelectRow, holidayId }: IProps) {
  return (
    <TableRow
      key={row.ItemNo}
      link={routeProperty.holidayItemInfo.path(holidayId, row.ItemNo)}
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
      <TableData>{formatDateView(row.StartDate)}</TableData>
      <TableData>{formatDateView(row.EndDate)}</TableData>
      <TableData>{row.DateName}</TableData>
    </TableRow>
  )
}

export default HolidayItemTableRow
