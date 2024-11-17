import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IOutputResult, outputStatObject, outputTypeObject } from '../../../types/pages/output'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IOutputResult
  selected: string[]
  handleSelectRow: (selectedId: string) => void
}

function OutputTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.OutputNo}
      link={routeProperty.outputInfo.path(row.OutputNo.toString())}
      selected={selected.indexOf(row.OutputNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.OutputNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.OutputNo}`}
          checked={selected.indexOf(row.OutputNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.OutputNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.OutputNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.OutputName}</TableData>
      <TableData>{row.OutputDesc}</TableData>
      <TableData>
        {row.Node?.NodeName}
        {row.Subnode && ` - ${row.Subnode.SubnodeName}`}
      </TableData>
      <TableData>{row.OutputPort}</TableData>
      <TableData>{outputTypeObject[row.OutputType]}</TableData>
      <TableData>{outputStatObject[row.OutputStat]}</TableData>
    </TableRow>
  )
}

export default OutputTableRow
