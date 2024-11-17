import { INewFormErrors } from '../../types/pages/common'
import { IDoorRuleFormData } from '../../types/pages/doorRule'
import t from '../../utils/translator'

const validateDoorRuleFormData = (
  formData: IDoorRuleFormData
): INewFormErrors<IDoorRuleFormData> => {
  const isPersonRuleTwo = 'Two Person Rule'
  const errors: INewFormErrors<IDoorRuleFormData> = {}
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  if (!formData.Schedule?.value) {
    errors.Schedule = t`Schedule is required`
  }
  // if (!formData.Door?.value) {
  //   errors.Door = t`Door is required`
  // }
  if (!formData.RuleName) {
    errors.RuleName = t`Name is required`
  }
  if (!formData.RuleType?.value) {
    errors.RuleType = t`Rule Type is required`
  }

  if (!formData.PersonSelect?.value) {
    errors.PersonSelect = t`Person Select is required`
  }
  if (formData.RuleType?.label === isPersonRuleTwo && !formData.PersonSelect2?.value) {
    errors.PersonSelect2 = t`Person Select 2 is required`
  }

  if (formData.RuleType?.value === '3' && !formData.CardTime) {
    errors.CardTime = t`Card time is required`
  }

  if (formData.RuleType?.value === '1' && !formData.GraceTime) {
    errors.GraceTime = t`Grace Time is required`
  }

  return errors
}
export default validateDoorRuleFormData
