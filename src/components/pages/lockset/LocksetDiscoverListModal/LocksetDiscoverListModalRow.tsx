import classNames from 'classnames'
import TableData from '../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../components/HOC/style/table/TableRow'
import { ILocksetDiscoverResult } from '../../../../types/pages/lockset'

type IProps = {
  row: ILocksetDiscoverResult
  checked: string
  setChecked: (_person: ILocksetDiscoverResult) => void
}
function LocksetDiscoverListModalRow({ row, checked, setChecked }: IProps) {
  return (
    <TableRow key={row.linkId} selected={checked === row.linkId.toString()}>
      <TableData>{row.linkId}</TableData>
      <TableData>{row.deviceName}</TableData>
      <TableData>{row.modelType}</TableData>
      <TableData>{row.deviceId}</TableData>
      <TableData>{row.linkCommStatus}</TableData>
      <TableData>{row.signalQuality}</TableData>
      <TableDataAction selected={checked === row.linkId.toString()}>
        <input
          value={row.linkId}
          checked={checked === row.linkId.toString()}
          onChange={() => setChecked(row)}
          type="radio"
          className={classNames(
            'float-left w-4 h-4 mt-1 mr-2 align-top transition duration-200  bg-center bg-no-repeat bg-contain border-2 border-gray-300 rounded-full appearance-none cursor-pointer checked:border-4 form-check-input  checked:border-primary focus:outline-none'
            // disabled ? 'cursor-default bg-[#F0F1F3]' : 'bg-white checked:bg-white',
          )}
        />
      </TableDataAction>
    </TableRow>
  )
}

export default LocksetDiscoverListModalRow
