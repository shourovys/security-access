import classNames from 'classnames'
import TableData from '../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../components/HOC/style/table/TableRow'
import { booleanSelectObject } from '../../../../types/pages/common'
import { IContLockDiscoverResult } from '../../../../types/pages/contLock'

type IProps = {
  row: IContLockDiscoverResult
  checked: string
  setChecked: (_person: IContLockDiscoverResult) => void
}
function ContLockDiscoverListModalRow({ row, checked, setChecked }: IProps) {
  return (
    <TableRow key={row.LockID} selected={checked === row.LockID.toString()}>
      <TableData>{row.RFAddress}</TableData>
      <TableData>{row.LockID}</TableData>
      <TableData>{row.RSSISend}</TableData>
      <TableData>{row.RSSIRecv}</TableData>
      {/* <TableData>{row.LockType}</TableData> */}
      {/* <TableData>{row.LockStatus}</TableData> */}
      {/* <TableData>{row.CodeVersion}</TableData> */}
      <TableData>{booleanSelectObject[row.Assigned]}</TableData>
      <TableDataAction selected={checked === row.LockID.toString()}>
        {row.Assigned === '0' && (
          <input
            value={row.LockID}
            checked={checked === row.LockID.toString()}
            onChange={() => setChecked(row)}
            type="radio"
            className={classNames(
              'float-left w-4 h-4 mt-1 mr-2 align-top transition duration-200  bg-center bg-no-repeat bg-contain border-2 border-gray-300 rounded-full appearance-none cursor-pointer checked:border-4 form-check-input  checked:border-primary focus:outline-none'
              // disabled ? 'cursor-default bg-[#F0F1F3]' : 'bg-white checked:bg-white',
            )}
          />
        )}
      </TableDataAction>
    </TableRow>
  )
}

export default ContLockDiscoverListModalRow
