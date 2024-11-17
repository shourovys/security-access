import TableData from '../../../../components/HOC/style/table/TableData'
import TableDataAction from '../../../../components/HOC/style/table/TableDataAction'
import TableRow from '../../../../components/HOC/style/table/TableRow'
import Checkbox from '../../../../components/atomic/Checkbox'
import { useParams } from 'react-router-dom'
import routeProperty from '../../../../routes/routeProperty'
import { credentialStatsObject, credentialTypesObject } from '../../../../types/pages/credential'
import { IParsonCredentials } from '../../../../types/pages/person'

type IProps = {
  row: IParsonCredentials
  selected: string[]
  handleSelectRow: (_selectedId: string) => void
}

function PersonCredentialListRow({ row, selected, handleSelectRow }: IProps) {
  // Get the person ID from the router query
  const params = useParams()
  const personId = params.id as string

  return (
    <TableRow
      key={row.CredentialNo}
      link={routeProperty.personCredentialInfo.path(row.CredentialNo.toString(), personId)}
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
      <TableData>{row.FormatName}</TableData>
      <TableData>{row.CredentialNumb}</TableData>
      <TableData>{credentialTypesObject[row.CredentialType]}</TableData>
      <TableData>{credentialStatsObject[row.CredentialStat]}</TableData>
    </TableRow>
  )
}

export default PersonCredentialListRow
