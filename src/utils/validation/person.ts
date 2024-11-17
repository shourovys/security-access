import { IFormErrors, INewFormErrors } from '../../types/pages/common'
import { IPersonFormData } from '../../types/pages/person'
import t from '../translator'

const validatePersonFormData = (formData: IPersonFormData): IFormErrors => {
  const errors: INewFormErrors<IPersonFormData> = {}

  // if (!formData.FirstName) {
  //   errors.FirstName = t`First Name is required`
  // }
  if (!formData.LastName) {
    errors.LastName = t`Last Name is required`
  }
  if (!formData.AccessSelect?.value) {
    errors.AccessSelect = t`Access Type is required`
  }
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  if (!formData.ThreatLevel?.value) {
    errors.ThreatLevel = t`Threat Level is required`
  }
  // if (formData.AccessSelect?.label === 'Group' && formData.GroupIds.length === 0) {
  //   errors.GroupIds = t`At least one group is required`
  // }
  // if (formData.AccessSelect?.label === 'Individual' && formData.AccessIds.length === 0) {
  //   errors.AccessIds = t`At least one door is required`
  // }

  return errors
}

export default validatePersonFormData
