import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IUserResult } from '../../../types/pages/user'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IUserResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function UserTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.UserNo}
      link={routeProperty.userInfo.path(row.UserNo)}
      selected={selected.indexOf(row.UserNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.UserNo.toString()) !== -1}>
        {row.UserNo !== 0 && (
          <Checkbox
            value={`select-row-${row.UserNo}`}
            checked={selected.indexOf(row.UserNo.toString()) !== -1}
            onChange={() => {
              handleSelectRow(row.UserNo.toString())
            }}
          />
        )}
      </TableDataAction>
      <TableData>{row.UserNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.UserId}</TableData>
      <TableData>{row.UserDesc}</TableData>
      <TableData>{row.Role.RoleName}</TableData>
    </TableRow>
  )
}

export default UserTableRow
