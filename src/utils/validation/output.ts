import { INewFormErrors } from '../../types/pages/common'
import { IOutputEditFormData, IOutputFormData } from '../../types/pages/output'
import t from '../translator'

const validateOutputFormData = (
  formData: IOutputFormData | IOutputEditFormData
): INewFormErrors<IOutputFormData | IOutputEditFormData> => {
  const errors: INewFormErrors<IOutputFormData | IOutputEditFormData> = {}
  if (!formData.OutputName) {
    errors.OutputName = t`Name is required`
  }
  // if (!formData.OutputPort) {
  //   errors.OutputPort = t`Port is required`;
  // }
  if (!formData.OutputType) {
    errors.OutputType = t`Type is required`
  }
  if (!formData.OnTime) {
    errors.OnTime = t`On Time is required`
  }
  if (!formData.OffTime) {
    errors.OffTime = t`Off Time is required`
  }
  if (!formData.Repeat) {
    errors.Repeat = t`Repeat is required`
  }
  // if (!formData.OutputStat?.value) {
  //   errors.OutputStat = t`Output Stat is required`;
  // }
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  if (!formData.FollowInput?.value) {
    errors.FollowInput = t`FollowInput is required`
  }
  if (formData.FollowInput?.value === '1' && !formData.Input?.value) {
    errors.Input = t`Input is required`
  }

  // if (!formData.Node?.value) {
  //     errors.Node = "Node is required";
  // }
  return errors
}

export default validateOutputFormData
