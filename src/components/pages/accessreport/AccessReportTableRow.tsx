import TableData from '../../../components/HOC/style/table/TableData'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { ILogResult } from '../../../types/pages/log'
import { formatDateTimeTzView, formatDateTimeView } from '../../../utils/formetTime'

type IProps = {
  row: ILogResult
  Reference?: string
}

function AccessReportTableRow({ row, Reference }: IProps) {
  return (
    <TableRow
      key={row.LogNo}
      link={Reference ? routeProperty.logInfo.path(row.LogNo.toString(), Reference) : undefined}
    >
      <TableData>{row.EventTime && formatDateTimeTzView(row.EventTime)}</TableData>
      <TableData>{row.EventName}</TableData>
      <TableData>{row.Person?.PersonNo}</TableData>
      <TableData>{row.PersonName}</TableData>
      <TableData>{row.CredentialNumb}</TableData>
      <TableData>{row.DeviceName}</TableData>
      <TableData>{row.Region?.RegionName}</TableData>
    </TableRow>
  )
}

export default AccessReportTableRow
