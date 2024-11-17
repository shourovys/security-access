import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IRelayResult, relayStatObject, relayTypeObject } from '../../../types/pages/relay'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IRelayResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}
function RelayTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.RelayNo}
      link={routeProperty.relayInfo.path(row.RelayNo)}
      selected={selected.indexOf(row.RelayNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.RelayNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.RelayNo}`}
          checked={selected.indexOf(row.RelayNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.RelayNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.RelayNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.RelayName}</TableData>
      <TableData>{row.RelayDesc}</TableData>
      <TableData>
        {row?.Node?.NodeName}
        {row.Subnode && ` - ${row.Subnode.SubnodeName}`}
      </TableData>
      <TableData>{row.RelayPort}</TableData>
      <TableData>{row.Elevator?.ElevatorName}</TableData>
      <TableData>{relayTypeObject[row.RelayType]}</TableData>
      <TableData>{relayStatObject[row.RelayStat]}</TableData>
    </TableRow>
  )
}

export default RelayTableRow
