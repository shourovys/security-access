import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { elevatorThreatLevelObject } from '../../../types/pages/elevator'
import { IThreatResult } from '../../../types/pages/threat'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IThreatResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function ThreatTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.ThreatNo}
      link={routeProperty.threatInfo.path(row.ThreatNo.toString())}
      selected={selected.indexOf(row.ThreatNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.ThreatNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.ThreatNo}`}
          checked={selected.indexOf(row.ThreatNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.ThreatNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.ThreatNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.ThreatName}</TableData>
      <TableData>{row.ThreatDesc}</TableData>
      <TableData>{elevatorThreatLevelObject[row.ThreatLevel]}</TableData>
    </TableRow>
  )
}

export default ThreatTableRow
