import { INewFormErrors } from '../../types/pages/common'
import { IContLockFormData } from '../../types/pages/contLock'
import t from '../../utils/translator'

const validateContLockFormData = (
  formData: IContLockFormData
): INewFormErrors<IContLockFormData> => {
  const errors: INewFormErrors<IContLockFormData> = {}

  if (!formData.ContLockName) {
    errors.ContLockName = t`ContLock Name is required`
  }
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  if (!formData.ContGate?.value) {
    errors.ContGate = t`ContGate is required`
  }
  if (!formData.RfAddress) {
    errors.RfAddress = t`RF Address is required`
  }
  if (!formData.LockId) {
    errors.LockId = t`Lock ID is required`
  }

  return errors
}

export default validateContLockFormData
