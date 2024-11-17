import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IEventActionResult } from '../../../types/pages/eventAction'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IEventActionResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function EventActionTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.EventActionNo}
      link={routeProperty.eventActionInfo.path(row.EventActionNo.toString())}
      selected={selected.indexOf(row.EventActionNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.EventActionNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.EventActionNo}`}
          checked={selected.indexOf(row.EventActionNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.EventActionNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.EventActionNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.EventActionName}</TableData>
      <TableData>{row.EventActionDesc}</TableData>
    </TableRow>
  )
}

export default EventActionTableRow
