import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { IChannelResult } from '../../../types/pages/channel'
import Checkbox from '../../atomic/Checkbox'
import t from '../../../utils/translator'
import useAuth from '../../../hooks/useAuth'

type IProps = {
  row: IChannelResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function ChannelTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.ChannelNo}
      link={routeProperty.channelInfo.path(row.ChannelNo)}
      selected={selected.indexOf(row.ChannelNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.ChannelNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.ChannelNo}`}
          checked={selected.indexOf(row.ChannelNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.ChannelNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.ChannelNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.ChannelName}</TableData>
      <TableData>{row.ChannelDesc}</TableData>
      <TableData>{row.Nvr.NvrName}</TableData>
      <TableData>{row.ChannelId}</TableData>
      <TableData>{row.Streaming ? t`Yes` : t`No`}</TableData>
      <TableData>{row.Online ? t`Yes` : t`No`}</TableData>
    </TableRow>
  )
}

export default ChannelTableRow
