import { INewFormErrors } from '../../types/pages/common'
import { IElevatorFormData } from '../../types/pages/elevator'
import t from '../translator'

const validateElevatorFormData = (
  formData: IElevatorFormData
): INewFormErrors<IElevatorFormData> => {
  const errors: INewFormErrors<IElevatorFormData> = {}
  if (!formData.ElevatorName) {
    errors.ElevatorName = t`Elevator Name is required`
  }
  if (!formData.ReaderType?.value) {
    errors.ReaderType = t`Reader Type is required`
  }
  // if (!formData.ThreatLevel?.value) {
  //   errors.ThreatLevel = t`Threat Level is required`
  // }
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  // if (!formData.Threat?.value) {
  //   errors.Threat = t`Threat is required`
  // }

  return errors
}

export default validateElevatorFormData
