import TableData from '../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../components/HOC/style/table/TableRow'
import routeProperty from '../../../routes/routeProperty'
import {
  ICredentialResult,
  credentialStatsObject,
  credentialTypesObject,
} from '../../../types/pages/credential'
import Checkbox from '../../atomic/Checkbox'

type IProps = {
  row: ICredentialResult
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function CredentialTableRow({ row, selected, handleSelectRow }: IProps) {
  return (
    <TableRow
      key={row.CredentialNo}
      link={routeProperty.credentialInfo.path(row.CredentialNo.toString())}
      selected={selected.indexOf(row.CredentialNo.toString()) !== -1}
    >
      <TableDataAction selected={selected.indexOf(row.CredentialNo.toString()) !== -1}>
        <Checkbox
          value={`select-row-${row.CredentialNo}`}
          checked={selected.indexOf(row.CredentialNo.toString()) !== -1}
          onChange={() => {
            handleSelectRow(row.CredentialNo.toString())
          }}
        />
      </TableDataAction>
      <TableData>{row.CredentialNo}</TableData>
      <TableData>{row.Format.FormatName}</TableData>
      <TableData>{row.CredentialNumb}</TableData>
      <TableData>{credentialTypesObject[row.CredentialType]}</TableData>
      <TableData>{credentialStatsObject[row.CredentialStat]}</TableData>
      <TableData>{row.Person?.FirstName}</TableData>
      <TableData>{row.Person?.LastName}</TableData>
      <TableData>{row.Person?.Email}</TableData>
    </TableRow>
  )
}

export default CredentialTableRow
