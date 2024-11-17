import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { IFormatResult, formatTypeObject } from '../../../types/pages/format'
import Checkbox from '../../atomic/Checkbox'
import t from '../../../utils/translator'

type IProps = {
  row: IFormatResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function FormatTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.FormatNo}
      link={routeProperty.formatInfo.path(row.FormatNo)}
      selected={selected.indexOf(row.FormatNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.FormatNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.FormatNo}`}
          checked={selected.indexOf(row.FormatNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.FormatNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.FormatNo}</TableData>
      <TableData>{row.FormatName}</TableData>
      <TableData>{row.FormatDesc}</TableData>
      <TableData>{row.DefaultFormat ? t`Yes` : t`No`}</TableData>
      <TableData>
        {typeof row.FormatType !== 'undefined' && formatTypeObject[row.FormatType]}
      </TableData>

      <TableData>{row.TotalLength}</TableData>
      <TableData>{row.FacilityCode}</TableData>
    </TableRow>
  )
}

export default FormatTableRow
