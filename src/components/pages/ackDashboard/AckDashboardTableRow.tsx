import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import { ILogResult } from '../../../types/pages/log'
import Checkbox from '../../atomic/Checkbox'
import { formatDateTimeTzView, formatDateTimeView } from '../../../utils/formetTime'

type IProps = {
  row: ILogResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function AckDashboardTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow key={row.LogNo} selected={selected.indexOf(row.LogNo.toString()) !== -1}>
      <TableDataAction selected={selected.indexOf(row.LogNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.LogNo}`}
          checked={selected.indexOf(row.LogNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.LogNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.LogNo}</TableData>
      <TableData>{row.EventTime && formatDateTimeTzView(row.EventTime)}</TableData>
      <TableData>{row.EventName}</TableData>
      <TableData>{row.DeviceName}</TableData>
      <TableData>{row.PersonName}</TableData>
    </TableRow>
  )
}

export default AckDashboardTableRow
