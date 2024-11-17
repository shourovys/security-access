import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { ITriggerResult } from '../../../types/pages/trigger'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: ITriggerResult
  selected: string[]
  handleSelectRow: (selectedId: string) => void
}

function TriggerTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.TriggerNo}
      link={routeProperty.triggerInfo.path(row.TriggerNo.toString())}
      selected={selected.indexOf(row.TriggerNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.TriggerNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.TriggerNo}`}
          checked={selected.indexOf(row.TriggerNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.TriggerNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.TriggerNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.TriggerName}</TableData>
      <TableData>{row.TriggerDesc}</TableData>
    </TableRow>
  )
}

export default TriggerTableRow
