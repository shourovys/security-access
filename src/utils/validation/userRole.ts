import { IFormErrors, INewFormErrors } from '../../types/pages/common'
import { IUserRoleFormData } from '../../types/pages/userRole'
import t from '../translator'

const validateUserRoleFormData = (formData: IUserRoleFormData): IFormErrors => {
  const errors: INewFormErrors<IUserRoleFormData> = {}
  if (!formData.RoleName) {
    errors.RoleName = t`User Role Name is required`
  }
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  if (!formData.PageIds.length) {
    errors.PageIds = t`Role Pages are required`
  }

  return errors
}
export default validateUserRoleFormData
