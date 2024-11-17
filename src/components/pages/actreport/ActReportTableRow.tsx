import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import { IListData } from '../../../data/_listData'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IListData
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}
function ActReportTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow key={row.id} selected={selected.indexOf(row.id.toString()) !== -1}>
      <TableDataAction selected={selected.indexOf(row.id.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.id}`}
          checked={selected.indexOf(row.id.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.id.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.id}</TableData>
      <TableData>{row.firstName}</TableData>
      <TableData>{row.lastName}</TableData>
      <TableData>{row.email}</TableData>
      <TableData>{row.phone}</TableData>
    </TableRow>
  )
}

export default ActReportTableRow
