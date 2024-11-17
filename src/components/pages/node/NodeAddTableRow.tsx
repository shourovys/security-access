import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import {
  ITempResult,
  nodeModelTypeObject,
  nodeProductTypeObject,
  nodeTypeObject,
} from '../../../types/pages/node'
import Checkbox from '../../atomic/Checkbox'
import t from '../../../utils/translator'

type IProps = {
  row: ITempResult
  selected: string[]
  handleSelectRow: (selectedId: string) => void
}

function NodeAddTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.TempNo}
      // link={routeProperty.nodeInfo.path(row.TempNo.toString())}
      selected={selected.indexOf(row.TempNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.TempNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.TempNo}`}
          checked={selected.indexOf(row.TempNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.TempNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.TempNo}</TableData>
      <TableData>{nodeTypeObject[row.NodeType]}</TableData>
      <TableData>{row.Elevator ? t`Yes` : t`No`}</TableData>
      <TableData>{row.Mac}</TableData>
      <TableData>{nodeProductTypeObject[row.Product]}</TableData>
      <TableData>{nodeModelTypeObject[row.Model]}</TableData>
      <TableData>{row.Type}</TableData>
      <TableData>{row.Version}</TableData>
      <TableData>
        <a
          href={'//' + row.Address}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary w-full min-w-full block hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.Address}
        </a>
      </TableData>
      <TableData>{row.Timezone}</TableData>
    </TableRow>
  )
}

export default NodeAddTableRow
