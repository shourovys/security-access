import { useState } from 'react'
import TableData from '../../../components/HOC/style/table/TableData'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { ILogResult } from '../../../types/pages/log'
import { formatDateTimeTzView, formatDateTimeView } from '../../../utils/formetTime'

type IProps = {
  row: ILogResult
  Reference?: string
}

function AckReportTableRow({ row, Reference }: IProps) {
  return (
    <TableRow
      key={row.LogNo}
      link={Reference ? routeProperty.logInfo.path(row.LogNo.toString(), Reference) : undefined}
    >
      <TableData>{row.LogNo}</TableData>
      <TableData>{row.EventTime && formatDateTimeTzView(row.EventTime)}</TableData>
      <TableData>{row.EventName}</TableData>
      <TableData>{row.DeviceName}</TableData>
      <TableData>{row.PersonName}</TableData>
      <TableData>{row.AckTime != 0 && formatDateTimeTzView(row.AckTime)}</TableData>
      <TableData>{row.AckUser}</TableData>
      <TableData>{row.Comment}</TableData>
    </TableRow>
  )
}

export default AckReportTableRow
