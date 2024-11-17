import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import {
  IBackupScheduleResult,
  backupScheduleMediaObject,
  maintenanceBackupScheduleObject,
} from '../../../types/pages/backupSchedule'
import Checkbox from '../../atomic/Checkbox'
import { formatDateTimeTzView, formatDateTimeView } from '../../../utils/formetTime'

type IProps = {
  row: IBackupScheduleResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function BackupScheduleTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.BackupNo}
      link={routeProperty.backupScheduleInfo.path(row.BackupNo.toString())}
      selected={selected.indexOf(row.BackupNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.BackupNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.BackupNo}`}
          checked={selected.indexOf(row.BackupNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.BackupNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.BackupNo}</TableData>
      <TableData>{row.BackupName}</TableData>
      <TableData>{row.BackupDesc}</TableData>
      <TableData>{backupScheduleMediaObject[row.Media.toString()]}</TableData>
      <TableData>{maintenanceBackupScheduleObject[row.BackupData.toString()]}</TableData>
      <TableData>{row.Schedule?.ScheduleName}</TableData>
      <TableData>{row.BackupTime == 0 ? '' : formatDateTimeTzView(row.BackupTime)}</TableData>
    </TableRow>
  )
}

export default BackupScheduleTableRow
