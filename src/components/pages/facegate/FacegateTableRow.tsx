import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { booleanSelectObject } from '../../../types/pages/common'
import {
  IFacegateResult,
  facegateContactStatObject,
  facegateLockStatObject,
} from '../../../types/pages/facegate'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: IFacegateResult
  selected: string[]
  handleSelectRow: (selectedId: string) => void
}

function FacegateTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.FacegateNo}
      link={routeProperty.facegateInfo.path(row.FacegateNo.toString())}
      selected={selected.indexOf(row.FacegateNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.FacegateNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.FacegateNo}`}
          checked={selected.indexOf(row.FacegateNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.FacegateNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.FacegateNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.FacegateName}</TableData>
      <TableData>{row.FacegateDesc}</TableData>
      <TableData>{row.Node?.NodeName}</TableData>
      <TableData>{row.IpAddress}</TableData>
      <TableData>{booleanSelectObject[row.Online]}</TableData>
      <TableData>{booleanSelectObject[row.Busy]}</TableData>
      <TableData>{facegateLockStatObject[row.LockStat]}</TableData>
      {/* <TableData>{facegateContactStatObject[row.ContactStat]}</TableData> */}
    </TableRow>
  )
}

export default FacegateTableRow
