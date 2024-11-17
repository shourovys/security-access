import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IHolidayResult } from '../../../types/pages/holiday'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IHolidayResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function HolidayTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.HolidayNo}
      link={routeProperty.holidayInfo.path(row.HolidayNo)}
      selected={selected.indexOf(row.HolidayNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.HolidayNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.HolidayNo}`}
          checked={selected.indexOf(row.HolidayNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.HolidayNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.HolidayNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.HolidayName}</TableData>
      <TableData>{row.HolidayDesc}</TableData>
    </TableRow>
  )
}

export default HolidayTableRow
