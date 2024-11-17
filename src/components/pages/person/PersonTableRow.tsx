import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import useAuth from '../../../hooks/useAuth'
import routeProperty from '../../../routes/routeProperty'
import { IDefinedFieldResult } from '../../../types/pages/definedField'
import { IPersonResult } from '../../../types/pages/person'
import { IMAGE_URL } from '../../../utils/config'
import Checkbox from '../../atomic/Checkbox'
import DefinedFieldsRows from './DefinedFieldsRows'

type IProps = {
  row: IPersonResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
  definedFields?: IDefinedFieldResult[]
}

function PersonTableRow({ row, selected, handleSelectRow, definedFields }: IProps) {
  const { showPartition } = useAuth()

  return (
    <TableRow
      key={row.PersonNo}
      link={routeProperty.personInfo.path(row.PersonNo)}
      selected={selected.indexOf(row.PersonNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.PersonNo.toString()) !== -1}>
        {row.PersonNo !== 0 && (
          <Checkbox
            value={`select-row-${row.PersonNo}`}
            checked={selected.indexOf(row.PersonNo.toString()) !== -1}
            onChange={() => {
              handleSelectRow(row.PersonNo.toString())
            }}
          />
        )}
      </TableDataAction>
      <TableData>{row.PersonNo}</TableData>
      {showPartition && <TableData>{row.Partition.PartitionName}</TableData>}
      <TableData>
        {row.ImageFile ? (
          <img src={IMAGE_URL + row.ImageFile} className="h-7 mx-auto rounded-full aspect-square" />
        ) : (
          <div className="flex items-center justify-center mx-auto bg-gray-200 rounded-full h-7 aspect-square pb-0.5">
            {row.LastName.charAt(0).toUpperCase()}
          </div>
        )}
      </TableData>
      <TableData>{row.FirstName}</TableData>
      <TableData>{row.LastName}</TableData>

      <TableData>{row.Email}</TableData>
      {definedFields?.map((item) => (
        <DefinedFieldsRows definedField={item} row={row} key={item.FieldNo} />
      ))}
    </TableRow>
  )
}

export default PersonTableRow
