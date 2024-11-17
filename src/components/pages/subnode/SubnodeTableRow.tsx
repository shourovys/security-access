import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { ISubnodeResult, subnodeDeviceTypeOptionsObject } from '../../../types/pages/subnode'
import Checkbox from '../../atomic/Checkbox'
import t from '../../../utils/translator'

type IProps = {
  row: ISubnodeResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function SubnodeTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.SubnodeNo}
      link={routeProperty.subnodeInfo.path(row.SubnodeNo.toString())}
      selected={selected.indexOf(row.SubnodeNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.SubnodeNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.SubnodeNo}`}
          checked={selected.indexOf(row.SubnodeNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.SubnodeNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.SubnodeNo}</TableData>
      <TableData>{row.SubnodeName}</TableData>
      <TableData>{row.SubnodeDesc}</TableData>
      <TableData>{row.Node.NodeName}</TableData>
      <TableData>{row.Address}</TableData>
      <TableData>{subnodeDeviceTypeOptionsObject[row.DeviceType]}</TableData>
      <TableData>{row.PortCount}</TableData>
      <TableData>{row.Online ? t`Yes` : t`No`}</TableData>
    </TableRow>
  )
}

export default SubnodeTableRow
