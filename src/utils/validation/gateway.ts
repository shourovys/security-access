import { INewFormErrors } from '../../types/pages/common'
import { IGatewayFormData } from '../../types/pages/gateway'
import t from '../translator'

const validateGatewayFormData = (formData: IGatewayFormData): INewFormErrors<IGatewayFormData> => {
  const errors: INewFormErrors<IGatewayFormData> = {}
  if (!formData.GatewayName) {
    errors.GatewayName = t`Gateway Name is required`
  }
  if (!formData.Node?.value) {
    errors.Node = t`Node is required`
  }
  if (!formData.IpAddress) {
    errors.IpAddress = t`IP Address is required`
  }
  if (!formData.ApiPort) {
    errors.ApiPort = t`API Port is required`
  }
  if (!formData.UserId) {
    errors.UserId = t`UserId is required`
  }
  if (!formData.Password) {
    errors.Password = t`Password is required`
  }

  return errors
}

export default validateGatewayFormData
