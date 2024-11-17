import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IFloorResult } from '../../../types/pages/floor'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IFloorResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function FloorTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.FloorNo}
      link={routeProperty.floorInfo.path(row.FloorNo)}
      selected={selected.indexOf(row.FloorNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.FloorNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.FloorNo}`}
          checked={selected.indexOf(row.FloorNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.FloorNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.FloorNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.FloorName}</TableData>
      <TableData>{row.FloorDesc}</TableData>
    </TableRow>
  )
}

export default FloorTableRow
