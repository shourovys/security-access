import classNames from 'classnames'
import TableData from '../../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../../components/HOC/style/table/TableRow'
import { IPersonResult } from '../../../../../types/pages/person'

type IProps = {
  row: IPersonResult
  checked: string
  setChecked: (_person: IPersonResult) => void
}

function PersonListModalRow({ row, checked, setChecked }: IProps) {
  return (
    <TableRow key={row.PersonNo} selected={checked === row.PersonNo.toString()}>
      <TableData>{row.PersonNo}</TableData>
      {/*<TableData>{row.Partition.PartitionName}</TableData>*/}
      <TableData>{row.FirstName}</TableData>
      <TableData>{row.MiddleName}</TableData>
      <TableData>{row.LastName}</TableData>
      {/*<TableData>{row.Email}</TableData>*/}
      <TableDataAction selected={checked === row.PersonNo.toString()}>
        <input
          value={row.PersonNo}
          checked={checked === row.PersonNo.toString()}
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

export default PersonListModalRow
