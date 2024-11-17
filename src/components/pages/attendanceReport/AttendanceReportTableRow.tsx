import { IAttendanceResult } from '../../../types/pages/attendanceReport'
import { formatDateTimeTzView } from '../../../utils/formetTime'
import TableData from '../../HOC/style/table/TableData'
import TableRow from '../../HOC/style/table/TableRow'

type IProps = {
  row: IAttendanceResult
}

function AttendanceReportTableRow({ row }: IProps) {
  const formatTime = (dateTime: number | null) => {
    if (!dateTime) {
      return ''
    }
    const [time, extension] = formatDateTimeTzView(dateTime).split(' ').slice(1)
    return extension ? `${time} ${extension}` : time
  }

  return (
    <TableRow key={row.LogNo}>
      <TableData>{row.InTime && formatDateTimeTzView(row.InTime).split(' ')[0]}</TableData>
      <TableData>{row.FirstName}</TableData>
      <TableData>{row.LastName}</TableData>
      <TableData>{formatTime(row.InTime)}</TableData>
      <TableData>{formatTime(row.OutTime)}</TableData>
    </TableRow>
  )
}

export default AttendanceReportTableRow
