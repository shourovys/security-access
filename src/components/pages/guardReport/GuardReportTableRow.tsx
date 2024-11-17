import TableData from '../../../components/HOC/style/table/TableData'
import TableRow from '../../../components/HOC/style/table/TableRow'
import { IGuardReportResult } from '../../../types/pages/guardReport'
import { formatDateTimeTzView } from '../../../utils/formetTime'

type IProps = {
  row: IGuardReportResult
  Reference?: string
}

function GuardReportTableRow({ row, Reference }: IProps) {
  return (
    <TableRow key={row.LogNo}>
      <TableData>{formatDateTimeTzView(row.EventTime)}</TableData>
      <TableData>{row.DeviceName}</TableData>
      <TableData>{row.PersonName}</TableData>
      <TableData>{row.CredentialNumb}</TableData>
    </TableRow>
  )
}

export default GuardReportTableRow
