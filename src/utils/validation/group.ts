import { INewFormErrors } from '../../types/pages/common'
import { IGroupFormData } from '../../types/pages/group'
import t from '../translator'

const validateGroupFormData = (formData: IGroupFormData): INewFormErrors<IGroupFormData> => {
  const errors: INewFormErrors<IGroupFormData> = {}
  if (!formData.GroupName) {
    errors.GroupName = t`Group Name is required`
  }
  // if (!formData.Partition?.value) {
  //   errors.Partition = t`Partition is required`
  // }
  // if (!formData.GroupType?.value) {
  //   errors.GroupType = t`Group Type is required`
  // }
  // if (!formData.GroupItems.length) {
  //   errors.GroupItems = t`Group Items are required`
  // }

  return errors
}
export default validateGroupFormData
