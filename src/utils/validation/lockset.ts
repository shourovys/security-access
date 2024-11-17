import { INewFormErrors } from '../../types/pages/common'
import { ILocksetFormData } from '../../types/pages/lockset'
import t from '../translator'

const validateLocksetFormData = (formData: ILocksetFormData): INewFormErrors<ILocksetFormData> => {
  const errors: INewFormErrors<ILocksetFormData> = {}
  if (!formData.LocksetName) {
    errors.LocksetName = t`Lockset name is required`
  }
  // if (!formData.Name) {
  //   errors.Name = t`Device name is required`
  // }
  if (!formData.LinkId) {
    errors.LinkId = t`Link ID is required`
  }
  if (!formData.DeviceId) {
    errors.DeviceId = t`Device ID is required`
  }
  if (!formData.Model) {
    errors.Model = t`Model is required`
  }
  if (!formData.Name) {
    errors.Name = t`Name is required`
  }
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  if (!formData.Gateway?.value) {
    errors.Gateway = t`Gateway is required`
  }
  return errors
}

export default validateLocksetFormData
