import { INewFormErrors } from '../../types/pages/common'
import { IContGateFormData } from '../../types/pages/contGate'
import t from '../translator'

const validateContGateFormData = (
  formData: IContGateFormData
): INewFormErrors<IContGateFormData> => {
  const errors: INewFormErrors<IContGateFormData> = {}

  if (!formData.ContGateName) {
    errors.ContGateName = t`ContGate Name is required`
  }
  if (!formData.Node?.value) {
    errors.Node = t`Node is required`
  }
  if (!formData.MacAddress) {
    errors.MacAddress = t`Mac Address is required`
  }
  if (!formData.IpAddress) {
    errors.IpAddress = t`IP Address is required`
  }
  if (!formData.ApiPort) {
    errors.ApiPort = t`Api Port is required`
  }
  if (!formData.RfChannel) {
    errors.RfChannel = t`Rf Channel is required`
  }
  if (!formData.SyncCode) {
    errors.SyncCode = t`Sync Code is required`
  }
  if (!formData.SecurityCode) {
    errors.SecurityCode = t`Security Code is required`
  }

  return errors
}

export default validateContGateFormData
