import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import {
  IArchiveScheduleResult,
  archiveScheduleMediaObject,
} from '../../../types/pages/archiveSchedule'
import Checkbox from '../../atomic/Checkbox'
import { formatDateTimeTzView, formatDateTimeView } from '../../../utils/formetTime'
import t from '../../../utils/translator'

type IProps = {
  row: IArchiveScheduleResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function ArchiveScheduleTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.ArchiveNo}
      link={routeProperty.archiveScheduleInfo.path(row.ArchiveNo.toString())}
      selected={selected.indexOf(row.ArchiveNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.ArchiveNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.ArchiveNo}`}
          checked={selected.indexOf(row.ArchiveNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.ArchiveNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.ArchiveNo}</TableData>
      <TableData>{row.ArchiveName}</TableData>
      <TableData>{row.ArchiveDesc}</TableData>
      <TableData>{archiveScheduleMediaObject[row.Media.toString()]}</TableData>
      <TableData>{row.UsageBased ? t`Yes` : t`No`}</TableData>
      <TableData>{row.UsageBased == 0 ? t`N/A` : row.UsagePercent}</TableData>
      <TableData>{row.UsageBased == 1 ? t`N/A` : row.Schedule?.ScheduleName}</TableData>
      <TableData>{row.ArchiveTime == 0 ? '' : formatDateTimeTzView(row.ArchiveTime)}</TableData>
    </TableRow>
  )
}

export default ArchiveScheduleTableRow
