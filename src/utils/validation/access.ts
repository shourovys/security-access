import { IAccessFormData } from '../../types/pages/access'
import { INewFormErrors } from '../../types/pages/common'
import t from '../translator'

const validateAccessFormData = (formData: IAccessFormData): INewFormErrors<IAccessFormData> => {
  const errors: INewFormErrors<IAccessFormData> = {}
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  if (!formData.AccessName) {
    errors.AccessName = t`Access Name is required`
  }
  // if (!formData.AccessDesc) {
  //   errors.AccessDesc = t`Description is required`
  // }
  if (!formData.Schedule?.value) {
    errors.Schedule = t`Schedule is required`
  }
  if (!formData.DeviceType?.value) {
    errors.DeviceType = t`Device Type is required`
  }
  if (!formData.DeviceSelect?.value) {
    errors.DeviceSelect = t`Select Type is required`
  }
  // if (
  //   formData.DeviceSelect?.value === 1 && // Group type
  //   !formData.Groups.length
  // ) {
  //   errors.Groups = t`Groups are required`
  // }
  // if (
  //   formData.DeviceSelect?.value === 0 && // Individual type
  //   !formData.Devices.length
  // ) {
  //   errors.Devices = t`Devices are required`
  // }
  return errors
}

export default validateAccessFormData
