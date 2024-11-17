import classNames from 'classnames'
import TableData from '../../components/HOC/style/table/TableData'
import TableDataAction from '../../components/HOC/style/table/TableDataAction'
import TableRow from '../../components/HOC/style/table/TableRow'
import { IFwUpdateResult } from '../../types/pages/common'

type IProps = {
  row: IFwUpdateResult
  checked: string
  setChecked: (selectedFW: IFwUpdateResult) => void
}
function FwUpdateListModalRow({ row, checked, setChecked }: IProps) {
  return (
    <TableRow key={row.Name} selected={checked === row.Name.toString()}>
      <TableData>{row.Name}</TableData>
      <TableData>{row.ReleaseDate}</TableData>
      <TableData>{row.Version}</TableData>
      <TableDataAction selected={checked === row.Name.toString()}>
        <input
          value={row.Name}
          checked={checked === row.Name.toString()}
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

export default FwUpdateListModalRow
