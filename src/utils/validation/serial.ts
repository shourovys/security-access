import { IFormErrors } from '../../types/pages/common'
import { ISerialFormData } from '../../types/pages/serial'
import t from '../translator'

const validateSerialFormData = (formData: ISerialFormData): IFormErrors => {
  const errors: IFormErrors = {}
  if (!formData.name) {
    errors.name = t`Serial Name is required`
  }
  if (!formData.node?.value) {
    errors.node = t`Node is required`
  }
  if (!formData.device) {
    errors.device = t`Device is required`
  }
  if (!formData.band_rate) {
    errors.band_rate = t`Band Rate is required`
  }
  if (!formData.data_bit) {
    errors.data_bit = t`Data Bit is required`
  }
  if (!formData.stop_bit) {
    errors.stop_bit = t`Stop Bit is required`
  }
  if (!formData.parity?.value) {
    errors.parity = t`Parity is required`
  }
  if (!formData.protocol?.value) {
    errors.protocol = t`Protocol is required`
  }

  return errors
}
export default validateSerialFormData
