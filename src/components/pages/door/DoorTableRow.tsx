import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import {
  IDoorResult,
  doorAlertStatObject,
  doorContactStatObject,
  doorLockStatObject,
  doorStatObject,
} from '../../../types/pages/door'

import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IDoorResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function DoorTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.DoorNo}
      link={routeProperty.doorInfo.path(row.DoorNo)}
      selected={selected.indexOf(row.DoorNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.DoorNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.DoorNo}`}
          checked={selected.indexOf(row.DoorNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.DoorNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.DoorNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.DoorName}</TableData>
      <TableData>{row.DoorDesc}</TableData>
      <TableData>
        {row.Node.NodeName}
        {row.Subnode && ` - ${row.Subnode.SubnodeName}`}
      </TableData>
      <TableData>{row.DoorPort}</TableData>
      <TableData>{doorStatObject[row.DoorStat]}</TableData>
      <TableData>{doorLockStatObject[row.LockStat]}</TableData>
      <TableData>{doorContactStatObject[row.ContactStat]}</TableData>
      <TableData>{doorAlertStatObject[row.AlertStat]}</TableData>
    </TableRow>
  )
}

export default DoorTableRow
