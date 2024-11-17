import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { booleanSelectObject } from '../../../types/pages/common'
import {
  IContLockResult,
  contLockContactStatObject,
  contLockLockStatObject,
} from '../../../types/pages/contLock'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IContLockResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function ContLockTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.ContLockNo}
      link={routeProperty.contLockInfo.path(row.ContLockNo.toString())}
      selected={selected.indexOf(row.ContLockNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.ContLockNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.ContLockNo}`}
          checked={selected.indexOf(row.ContLockNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.ContLockNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.ContLockNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.ContLockName}</TableData>
      <TableData>{row.ContLockDesc}</TableData>
      <TableData>{row.ContGate?.ContGateName}</TableData>
      <TableData>{row.RfAddress}</TableData>
      <TableData>{booleanSelectObject[row.Online]}</TableData>
      <TableData>{booleanSelectObject[row.Busy]}</TableData>
      <TableData>{contLockLockStatObject[row.LockStat]}</TableData>
      {/* <TableData>{contLockContactStatObject[row.ContactStat]}</TableData> */}
    </TableRow>
  )
}

export default ContLockTableRow
