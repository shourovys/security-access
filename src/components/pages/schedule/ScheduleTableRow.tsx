import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IScheduleResult } from '../../../types/pages/schedule'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IScheduleResult
  selected: string[]
  handleSelectRow: (_selectedNo: string) => void
}

function ScheduleTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.ScheduleNo}
      link={routeProperty.scheduleInfo.path(row.ScheduleNo.toString())}
      selected={selected.indexOf(row.ScheduleNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.ScheduleNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.ScheduleNo}`}
          checked={selected.indexOf(row.ScheduleNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.ScheduleNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.ScheduleNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.ScheduleName}</TableData>
      <TableData>{row.ScheduleDesc}</TableData>
    </TableRow>
  )
}

export default ScheduleTableRow
