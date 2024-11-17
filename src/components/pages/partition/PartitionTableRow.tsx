import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { IPartitionResult } from '../../../types/pages/partition'
import { IMAGE_URL } from '../../../utils/config'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IPartitionResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}
function PartitionTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.PartitionNo}
      link={routeProperty.partitionInfo.path(row.PartitionNo)}
      selected={selected.indexOf(row.PartitionNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.PartitionNo.toString()) !== -1}>
        {row.PartitionNo !== 0 && (
          <Checkbox
            value={`select-row-${row.PartitionNo}`}
            checked={selected.indexOf(row.PartitionNo.toString()) !== -1}
            onChange={() => {
              handleSelectRow(row.PartitionNo.toString())
            }}
          />
        )}
      </TableDataAction>
      <TableData>{row.PartitionNo}</TableData>
      <TableData>
        {row.ImageFile ? (
          <img src={IMAGE_URL + row.ImageFile} className="h-7 aspect-square rounded-full mx-auto" />
        ) : (
          <div className="h-7 aspect-square bg-gray-200 rounded-full flex items-center justify-center mx-auto pb-0.5">
            {row.PartitionName.charAt(0).toUpperCase()}
          </div>
        )}
      </TableData>
      <TableData>{row.PartitionName}</TableData>
      <TableData>{row.PartitionDesc}</TableData>
    </TableRow>
  )
}
export default PartitionTableRow
