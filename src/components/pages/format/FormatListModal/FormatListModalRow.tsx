import classNames from 'classnames'
import TableData from '../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../components/HOC/style/table/TableRow'
import { IFormatResult } from '../../../../types/pages/format'

type IProps = {
  row: IFormatResult
  checked: string
  setChecked: (_format: IFormatResult) => void
}
function FormatListModalRow({ row, checked, setChecked }: IProps) {
  return (
    <TableRow key={row.FormatNo} selected={checked === row.FormatNo.toString()}>
      <TableData>{row.FormatNo}</TableData>
      <TableData>{row.FormatName}</TableData>
      <TableData>{row.TotalLength}</TableData>
      <TableData>{row.FacilityCode}</TableData>
      <TableDataAction selected={checked === row.FormatNo.toString()}>
        <input
          value={row.FormatNo}
          checked={checked === row.FormatNo.toString()}
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

export default FormatListModalRow
