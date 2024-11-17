import { INewFormErrors } from '../../types/pages/common'
import { ISubnodeFormData } from '../../types/pages/subnode'
import t from '../translator'

const validateSubNodeFormData = (formData: ISubnodeFormData): INewFormErrors<ISubnodeFormData> => {
  const errors: INewFormErrors<ISubnodeFormData> = {}
  if (!formData.SubnodeName) {
    errors.SubnodeName = t`Name is required`
  }

  if (!formData.Node?.value) {
    errors.Node = t`Node is required`
  }

  if (!formData.Address) {
    errors.Address = t`Address is required`
  }

  if (!formData.Device) {
    errors.Device = t`Device is required`
  }

  if (!formData.Baudrate) {
    errors.Baudrate = t`Baudrate is required`
  }

  if (!formData.DeviceType?.value) {
    errors.DeviceType = t`Device Type is required`
  }

  if (!formData.PortCount) {
    errors.PortCount = t`Port Count is required`
  }

  return errors
}

export default validateSubNodeFormData
