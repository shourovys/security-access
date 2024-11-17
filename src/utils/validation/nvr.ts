import { INewFormErrors } from '../../types/pages/common'
import { INvrFormData } from '../../types/pages/nvr'
import t from '../translator'

const validateNvrFormData = (formData: INvrFormData): INewFormErrors<INvrFormData> => {
  const errors: INewFormErrors<INvrFormData> = {}
  if (!formData.NvrName) {
    errors.NvrName = t`NVR Name is required`
  }
  if (!formData.NvrType?.value) {
    errors.NvrType = t`NVR Type is required`
  }
  if (!formData.IpAddress) {
    errors.IpAddress = t`IP Address is required`
  }
  if (!formData.RtspPort) {
    errors.RtspPort = t`RTSP Port is required`
  }
  // if (formData?.NvrType?.value !== '0' && !formData.DataPort) {
  //   errors.DataPort = t`Data Port is required`
  // }
  if (!formData.UserId) {
    errors.UserId = t`User ID is required`
  }
  if (!formData.Password) {
    errors.Password = t`Password is required`
  }

  return errors
}

export default validateNvrFormData
