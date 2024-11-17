import classNames from 'classnames'
import TableData from '../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../components/HOC/style/table/TableRow'
import { booleanSelectObject } from '../../../../types/pages/common'
import { IContGateDiscoverResult } from '../../../../types/pages/contGate'

type IProps = {
  row: IContGateDiscoverResult
  checked: string
  setChecked: (_person: IContGateDiscoverResult) => void
}
function ContGateDiscoverListModalRow({ row, checked, setChecked }: IProps) {
  return (
    <TableRow key={row.MacAddress} selected={checked === row.MacAddress.toString()}>
      <TableData>{row.MacAddress}</TableData>
      <TableData>{row.IpAddress}</TableData>
      <TableData>{row.ApiPort}</TableData>
      <TableData>{booleanSelectObject[row.Ready]}</TableData>
      <TableDataAction selected={checked === row.MacAddress.toString()}>
        {row.Ready === '1' && (
          <input
            value={row.MacAddress}
            checked={checked === row.MacAddress.toString()}
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

export default ContGateDiscoverListModalRow
