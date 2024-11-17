import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { lockSelectObject } from '../../../types/pages/common'
import { ILocksetResult } from '../../../types/pages/lockset'
import t from '../../../utils/translator'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: ILocksetResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function LocksetTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.LocksetNo}
      link={routeProperty.locksetInfo.path(row.LocksetNo.toString())}
      selected={selected.indexOf(row.LocksetNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.LocksetNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.LocksetNo}`}
          checked={selected.indexOf(row.LocksetNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.LocksetNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.LocksetNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.LocksetName}</TableData>
      <TableData>{row.LocksetDesc}</TableData>
      <TableData>{row.Gateway?.GatewayName}</TableData>
      <TableData>{row.LinkId}</TableData>
      <TableData>{row.Online ? t`Yes` : t`No`}</TableData>
      <TableData>{lockSelectObject[row.LockStat]}</TableData>
      {/* <TableData>{activeSelectObject[row.ContactStat]}</TableData> */}
    </TableRow>
  )
}

export default LocksetTableRow
