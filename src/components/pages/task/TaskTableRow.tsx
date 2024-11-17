import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { ITaskResult, taskActionTypesObject } from '../../../types/pages/task'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: ITaskResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function TaskTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.TaskNo}
      link={routeProperty.taskInfo.path(row.TaskNo.toString())}
      selected={selected.indexOf(row.TaskNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.TaskNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.TaskNo}`}
          checked={selected.indexOf(row.TaskNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.TaskNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.TaskNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.TaskName}</TableData>
      <TableData>{row.TaskDesc}</TableData>
      <TableData>{taskActionTypesObject[row.ActionType]}</TableData>
    </TableRow>
  )
}

export default TaskTableRow
