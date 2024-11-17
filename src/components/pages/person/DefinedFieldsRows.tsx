import TableData from '../../../components/HOC/style/table/TableData'
import { IDefinedFieldResult } from '../../../types/pages/definedField'
import { IPersonResult } from '../../../types/pages/person'

interface IProps {
  definedField: IDefinedFieldResult
  row: IPersonResult
}

function DefinedFieldsRows({ definedField, row }: IProps) {
  const { FieldNo, ListEnable } = definedField
  if (ListEnable) {
    switch (FieldNo) {
      case 1:
        return <TableData>{row.Field1}</TableData>
      case 2:
        return <TableData>{row.Field2}</TableData>
      case 3:
        return <TableData>{row.Field3}</TableData>
      case 4:
        return <TableData>{row.Field4}</TableData>
      case 5:
        return <TableData>{row.Field5}</TableData>
      case 6:
        return <TableData>{row.Field6}</TableData>
      case 7:
        return <TableData>{row.Field7}</TableData>
      case 8:
        return <TableData>{row.Field8}</TableData>
      case 9:
        return <TableData>{row.Field9}</TableData>
      case 10:
        return <TableData>{row.Field10}</TableData>
      case 11:
        return <TableData>{row.Field11}</TableData>
      case 12:
        return <TableData>{row.Field12}</TableData>
      case 13:
        return <TableData>{row.Field13}</TableData>
      case 14:
        return <TableData>{row.Field14}</TableData>
      case 15:
        return <TableData>{row.Field15}</TableData>
      default:
        return null
    }
  }

  return null
}

export default DefinedFieldsRows
