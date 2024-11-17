import TableData from '../../../components/HOC/style/table/TableData'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { IReaderResult } from '../../../types/pages/reader'

type IProps = {
  row: IReaderResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function ReaderTableRow({ row, selected }: IProps) {
  return (
    <TableRow
      key={row.ReaderNo}
      link={routeProperty.readerInfo.path(row.ReaderNo.toString())}
      selected={selected.indexOf(row.ReaderNo.toString()) !== -1}
    >
      <TableData>{row.ReaderNo}</TableData>
      <TableData>{row.ReaderName}</TableData>
      <TableData>{row.ReaderDesc}</TableData>
      <TableData>{row.Node.NodeName}</TableData>
      <TableData>{row.Subnode.SubnodeName}</TableData>
      <TableData>{row.ReaderPort}</TableData>
      {/*<TableDataAction selected={selected.indexOf(row.ReaderNo.toString()) !== -1}>*/}
      {/*  <Checkbox*/}
      {/*    value={`select-row-${row.ReaderNo}`}*/}
      {/*    checked={selected.indexOf(row.ReaderNo.toString()) !== -1}*/}
      {/*    onChange={() => {*/}
      {/*      handleSelectRow(row.ReaderNo.toString())*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</TableDataAction>*/}
    </TableRow>
  )
}

export default ReaderTableRow
