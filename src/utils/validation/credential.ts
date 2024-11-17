import { INewFormErrors } from '../../types/pages/common'
import { ICredentialFormData } from '../../types/pages/credential'
import validatePersonFormData from './person'
import t from '../translator'

const validateCredentialFormData = (
  formData: ICredentialFormData
): INewFormErrors<ICredentialFormData> => {
  const errors: INewFormErrors<ICredentialFormData> = {}

  if (!formData.Format?.value) {
    errors.Format = t`Format is required`
  }
  // if (!formData.CredentialNumb) {
  //   errors.CredentialNumb = t`Credential Number is required`
  // }
  // if (!formData.SubKeyNumb) {
  //   errors.SubKeyNumb = t`Sub Key Number is required`
  // }
  if (!formData.CredentialType?.value) {
    errors.CredentialType = t`Credential Type is required`
  }
  if (!formData.CredentialStat?.value) {
    errors.CredentialStat = t`Credential Stat is required`
  }
  if (!formData.CredentialAccessSelect?.value) {
    errors.CredentialAccessSelect = t`Select Type is required`
  }

  if (formData.NeverExpired?.value === '0') {
    if (!formData.StartTime) {
      errors.StartTime = t`Start Time is required`
    }
    if (!formData.EndTime) {
      errors.EndTime = t`End Time is required`
    }
  }

  // if (!formData.EventTime) {
  //     errors.EventTime = "Event Time is required";
  // }
  // if (formData.AccessSelect?.label !== 'Individual' && formData.CredentialGroupIds.length === 0) {
  //   errors.CredentialGroupIds = t`At least one group Credential Access is required`
  // }
  // if (
  //   formData.AccessSelect?.label === 'Individual' &&
  //   formData.CredentialAccessIds.length === 0
  // ) {
  //   errors.CredentialAccessIds = t`At least one Credential Access is required`
  // }

  // person data validation
  const personErrors = validatePersonFormData(formData)

  return { ...errors, ...personErrors }
}

export default validateCredentialFormData
