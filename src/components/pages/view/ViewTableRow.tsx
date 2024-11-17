import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IViewResult } from '../../../types/pages/view'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IViewResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function ViewTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.ViewNo}
      link={routeProperty.viewInfo.path(row.ViewNo.toString())}
      selected={selected.indexOf(row.ViewNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.ViewNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.ViewNo}`}
          checked={selected.indexOf(row.ViewNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.ViewNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.ViewNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.ViewName}</TableData>
      <TableData>{row.ViewDesc}</TableData>
    </TableRow>
  )
}

export default ViewTableRow
