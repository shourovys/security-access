import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import { accessDeviceTypes, IAccessResult } from '../../../types/pages/access'
import { findSelectOption } from '../../../utils/findSelectOption'
import Checkbox from '../../atomic/Checkbox'
import useLicenseFilter from '../../../hooks/useLicenseFilter'
import useAuth from '../../../hooks/useAuth'

type IProps = {
  row: IAccessResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function AccessTableRow({ row, selected, handleSelectRow }: IProps) {
  const { showPartition } = useAuth()
  const filteredAccessDeviceTypes = useLicenseFilter(accessDeviceTypes, {
    '12': 'Lockset',
    '13': 'Facegate',
    '17': 'ContLock',
    '18': 'Intercom',
  })
  return (
    <TableRow
      key={row.AccessNo}
      link={routeProperty.accessInfo.path(row.AccessNo)}
      selected={selected.indexOf(row.AccessNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.AccessNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.AccessNo}`}
          checked={selected.indexOf(row.AccessNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.AccessNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.AccessNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>{row.AccessName}</TableData>
      <TableData>{row.AccessDesc}</TableData>
      <TableData>{findSelectOption(filteredAccessDeviceTypes, row.AccessType)?.label}</TableData>
    </TableRow>
  )
}

export default AccessTableRow
