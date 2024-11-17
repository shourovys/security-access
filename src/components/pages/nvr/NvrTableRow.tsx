import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { INvrResult, nvrTypeObject } from '../../../types/pages/nvr'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: INvrResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function NvrTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.NvrNo}
      link={routeProperty.nvrInfo.path(row.NvrNo.toString())}
      selected={selected.indexOf(row.NvrNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.NvrNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.NvrNo}`}
          checked={selected.indexOf(row.NvrNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.NvrNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.NvrNo}</TableData>
      <TableData>{row.NvrName}</TableData>
      <TableData>{row.NvrDesc}</TableData>
      <TableData>{nvrTypeObject[row.NvrType]}</TableData>
      <TableData>{row.IpAddress}</TableData>
    </TableRow>
  )
}

export default NvrTableRow
