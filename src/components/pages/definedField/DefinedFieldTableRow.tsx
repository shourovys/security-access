import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { IDefinedFieldResult } from '../../../types/pages/definedField'
import Checkbox from '../../atomic/Checkbox'
import t from '../../../utils/translator'

type IProps = {
  row: IDefinedFieldResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}
function DefinedFieldTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.FieldNo}
      link={routeProperty.definedFieldInfo.path(row.FieldNo)}
      selected={selected.indexOf(row.FieldNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.FieldNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.FieldNo}`}
          checked={selected.indexOf(row.FieldNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.FieldNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.FieldNo}</TableData>
      <TableData>{row.FieldName}</TableData>
      <TableData>{row.FieldEnable ? t`Yes` : t`No`}</TableData>
      <TableData>{row.ListEnable ? t`Yes` : t`No`}</TableData>
      <TableData>{row.FilterEnable ? t`Yes` : t`No`}</TableData>
    </TableRow>
  )
}

export default DefinedFieldTableRow
