import { THandleFilterInputChange } from '../../../types/components/common'
import { IDefinedFieldResult } from '../../../types/pages/definedField'
import { IPersonFilters } from '../../../types/pages/person'
import Input from '../../atomic/Input'

interface IProps {
  definedField: IDefinedFieldResult
  filterState: IPersonFilters
  handleInputChange: THandleFilterInputChange
}

function DefinedFieldsInputs({ definedField, filterState, handleInputChange }: IProps) {
  const { FieldNo, FieldEnable, FieldName } = definedField
  if (FieldEnable) {
    switch (FieldNo) {
      case 1:
        return (
          <Input
            name="Field1"
            placeholder={FieldName}
            value={filterState.Field1}
            onChange={handleInputChange}
          />
        )
      case 2:
        return (
          <Input
            name="Field2"
            placeholder={FieldName}
            value={filterState.Field2}
            onChange={handleInputChange}
          />
        )
      case 3:
        return (
          <Input
            name="Field3"
            placeholder={FieldName}
            value={filterState.Field3}
            onChange={handleInputChange}
          />
        )
      case 4:
        return (
          <Input
            name="Field4"
            placeholder={FieldName}
            value={filterState.Field4}
            onChange={handleInputChange}
          />
        )
      case 5:
        return (
          <Input
            name="Field5"
            placeholder={FieldName}
            value={filterState.Field5}
            onChange={handleInputChange}
          />
        )
      case 6:
        return (
          <Input
            name="Field6"
            placeholder={FieldName}
            value={filterState.Field6}
            onChange={handleInputChange}
          />
        )
      case 7:
        return (
          <Input
            name="Field7"
            placeholder={FieldName}
            value={filterState.Field7}
            onChange={handleInputChange}
          />
        )
      case 8:
        return (
          <Input
            name="Field8"
            placeholder={FieldName}
            value={filterState.Field8}
            onChange={handleInputChange}
          />
        )
      case 9:
        return (
          <Input
            name="Field9"
            placeholder={FieldName}
            value={filterState.Field9}
            onChange={handleInputChange}
          />
        )
      case 10:
        return (
          <Input
            name="Field10"
            placeholder={FieldName}
            value={filterState.Field10}
            onChange={handleInputChange}
          />
        )
      case 11:
        return (
          <Input
            name="Field11"
            placeholder={FieldName}
            value={filterState.Field11}
            onChange={handleInputChange}
          />
        )
      case 12:
        return (
          <Input
            name="Field12"
            placeholder={FieldName}
            value={filterState.Field12}
            onChange={handleInputChange}
          />
        )
      case 13:
        return (
          <Input
            name="Field13"
            placeholder={FieldName}
            value={filterState.Field13}
            onChange={handleInputChange}
          />
        )
      case 14:
        return (
          <Input
            name="Field14"
            placeholder={FieldName}
            value={filterState.Field14}
            onChange={handleInputChange}
          />
        )
      case 15:
        return (
          <Input
            name="Field15"
            placeholder={FieldName}
            value={filterState.Field15}
            onChange={handleInputChange}
          />
        )
      default:
        return null
    }
  }

  return null
}

export default DefinedFieldsInputs
