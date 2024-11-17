import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { IGatewayResult } from '../../../types/pages/gateway'
import Checkbox from '../../atomic/Checkbox'
import t from '../../../utils/translator'

type IProps = {
  row: IGatewayResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function GatewayTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.GatewayNo}
      link={routeProperty.gatewayInfo.path(row.GatewayNo)}
      selected={selected.indexOf(row.GatewayNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.GatewayNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.GatewayNo}`}
          checked={selected.indexOf(row.GatewayNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.GatewayNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.GatewayNo}</TableData>
      <TableData>{row.GatewayName}</TableData>
      <TableData>{row.GatewayDesc}</TableData>
      <TableData>{row.Node.NodeName}</TableData>
      <TableData>{row.IpAddress}</TableData>
      <TableData>{row.Online ? t`Yes` : t`No`}</TableData>
    </TableRow>
  )
}

export default GatewayTableRow
