import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { INodeResult, nodeProductTypeObject, nodeTypeObject } from '../../../types/pages/node'
import Checkbox from '../../atomic/Checkbox'
import t from '../../../utils/translator'

type IProps = {
  row: INodeResult
  selected: string[]
  handleSelectRow: (node: INodeResult) => void
}

function NodeTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.NodeNo}
      link={routeProperty.nodeInfo.path(row.NodeNo.toString())}
      selected={selected.indexOf(row.NodeNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.NodeNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.NodeNo}`}
          checked={selected.indexOf(row.NodeNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row)
          }}
        />
      </TableDataAction>
      <TableData>{row.NodeNo}</TableData>
      <TableData>{row.NodeName}</TableData>
      <TableData>{row.NodeDesc}</TableData>
      <TableData>{nodeTypeObject[row.NodeType]}</TableData>
      <TableData>{row.Elevator ? t`Yes` : t`No`}</TableData>
      <TableData>{row.Mac}</TableData>
      <TableData>{nodeProductTypeObject[row.Product]}</TableData>
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
      <TableData>{row.Online ? t`Yes` : t`No`}</TableData>
    </TableRow>
  )
}

export default NodeTableRow
