import { IOccupancyResult } from '../../../types/pages/occupancyReport'
import { formatDateTimeTzView } from '../../../utils/formetTime'
import TableData from '../../HOC/style/table/TableData'
import TableRow from '../../HOC/style/table/TableRow'

type IProps = {
  row: IOccupancyResult
  Reference?: string
}
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function OccupancyReportTableRow({ row, Reference }: IProps) {
  return (
    <TableRow key={row.LogNo}>
      <TableData>{row.RegionName}</TableData>
      <TableData>{row.FirstName}</TableData>
      <TableData>{row.LastName}</TableData>
      <TableData>{row.EventTime && formatDateTimeTzView(row.EventTime)}</TableData>
      <TableData>{formatDuration(row.Duration)}</TableData>
    </TableRow>
  )
}

export default OccupancyReportTableRow
