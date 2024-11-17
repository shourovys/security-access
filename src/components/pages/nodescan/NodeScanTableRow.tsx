import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import {
  nodeModelTypeObject,
  nodeProductTypeObject,
  nodeTypeObject,
} from '../../../types/pages/node'
import { INodeScanResult } from '../../../types/pages/nodeScan'
import Checkbox from '../../atomic/Checkbox'
import t from '../../../utils/translator'

type IProps = {
  row: INodeScanResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function NodeScanTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.Mac}
      // link={routeProperty.nodeScanInfo.path(row.id)}
      selected={selected.indexOf(row.Mac) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.Mac) !== -1}>
        <Checkbox
          value={`select-row-${row.Mac}`}
          checked={selected.indexOf(row.Mac) !== -1}
          onChange={() => {
            handleSelectRow(row.Mac)
          }}
        />
      </TableDataAction>
      <TableData>{row.Mac}</TableData>
      <TableData>{nodeTypeObject[row.NodeType]}</TableData>
      <TableData>{row.Elevator === '1' ? t`Yes` : t`No`}</TableData>
      <TableData>{nodeProductTypeObject[row.Product]}</TableData>
      <TableData>{nodeModelTypeObject[row.Model]}</TableData>
      <TableData>{row.Type}</TableData>
      <TableData>{row.Licensed === '1' ? t`Yes` : t`No`}</TableData>
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
      <TableData>{row.Version}</TableData>
    </TableRow>
  )
}

export default NodeScanTableRow
