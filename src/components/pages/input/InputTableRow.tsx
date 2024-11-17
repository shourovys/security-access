import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IInputResult, inputStatObject, inputTypeObject } from '../../../types/pages/input'
import Checkbox from '../../atomic/Checkbox'

interface IProps {
  row: IInputResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function InputTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.InputNo}
      link={routeProperty.inputInfo.path(row.InputNo.toString())}
      selected={selected.indexOf(row.InputNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.InputNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.InputNo}`}
          checked={selected.indexOf(row.InputNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.InputNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.InputNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.InputName}</TableData>
      <TableData>{row.InputDesc}</TableData>
      <TableData>
        {row.Node?.NodeName}
        {row.Subnode && ` - ${row.Subnode.SubnodeName}`}
      </TableData>
      <TableData>{row.InputPort}</TableData>
      <TableData>{inputTypeObject[row.InputType]}</TableData>
      <TableData>{inputStatObject[row.InputStat]}</TableData>
    </TableRow>
  )
}

export default InputTableRow
