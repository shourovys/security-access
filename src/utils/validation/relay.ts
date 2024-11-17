import { INewFormErrors } from '../../types/pages/common'
import { IRelayFormData } from '../../types/pages/relay'
import t from '../translator'

const validateRelayFormData = (formData: IRelayFormData): INewFormErrors<IRelayFormData> => {
  const errors: INewFormErrors<IRelayFormData> = {}

  if (!formData.RelayName) {
    errors.RelayName = t`Relay Name is required`
  }
  // if (!formData.Node || !formData.Node.value) {
  //   errors.Node = t`Node is required`
  // }
  if (!formData.Partition || !formData.Partition.value) {
    errors.Partition = t`Partition is required`
  }
  // if (!formData.RelayPort) {
  //   errors.RelayPort = t`Port is required`
  // } else if (Number.isNaN(Number(formData.RelayPort))) {
  //   errors.RelayPort = t`Port must be a number`
  // }
  if (!formData.RelayType || !formData.RelayType.value) {
    errors.RelayType = t`Type is required`
  }
  if (!formData.OnTime) {
    errors.OnTime = t`On Time is required`
  } else if (Number.isNaN(Number(formData.OnTime))) {
    errors.OnTime = t`On Time must be a number`
  }
  if (!formData.OffTime) {
    errors.OffTime = t`Off Time is required`
  } else if (Number.isNaN(Number(formData.OffTime))) {
    errors.OffTime = t`Off Time must be a number`
  }
  if (!formData.Repeat) {
    errors.Repeat = t`Repeat is required`
  } else if (Number.isNaN(Number(formData.Repeat))) {
    errors.Repeat = t`Repeat must be a number`
  }
  // if (!formData.RelayStat?.value) {
  //   errors.RelayStat = t`Relay Stat is required`
  // }

  return errors
}

export default validateRelayFormData
