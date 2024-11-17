import { INewFormErrors } from '../../types/pages/common'
import { IDoorFormData } from '../../types/pages/door'
import t from '../../utils/translator'

const validateDoorFormData = (formData: IDoorFormData): INewFormErrors<IDoorFormData> => {
  const errors: INewFormErrors<IDoorFormData> = {}
  if (!formData.DoorName) {
    errors.DoorName = t`Door Name is required`
  }
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }

  // if (formData.InEnable?.value==='1' && formData.SubnodeNo ==='0' && readerData.length && !formData.InReader?.value) {
  //   errors.InReader = t`In Reader is required`
  // }
  // if (formData.OutEnable?.value==='1' && formData.SubnodeNo ==='0'  && readerData.length &&  !formData.OutReader?.value) {
  //   errors.OutReader = t`Out Reader is required`
  // }

  if (
    formData.RexEnable?.value === '1' &&
    formData.SubnodeNo !== '0' &&
    !formData.RexInput?.value
  ) {
    errors.RexInput = t`Rex Input is required`
  }
  if (formData.SubnodeNo !== '0' && !formData.LockOutput?.value) {
    errors.LockOutput = t`Lock Output is required`
  }
  if (
    formData.ContactEnable?.value === '1' &&
    formData.SubnodeNo !== '0' &&
    !formData.ContactInput?.value
  ) {
    errors.ContactInput = t`Door Contact Input is required`
  }
  if (formData.ContactEnable?.value === '1' && !formData.ProppedTime) {
    errors.ProppedTime = t`Propped time is required`
  }

  if (formData.ContactEnable?.value === '1' && formData.ProppedTime) {
    // 1 to 60 seconds
    const phase = parseInt(formData.ProppedTime)
    if (phase < 1 || phase > 60) {
      errors.ProppedTime = t`Propped time must be between 1 to 60 seconds`
    }
  }

  if (formData.ContactEnable?.value === '1' && !formData.AdaTime) {
    errors.AdaTime = t`ADA time is required`
  }

  if (formData.ContactEnable?.value === '1' && formData.AdaTime) {
    // 1 to 60 seconds
    const phase = parseInt(formData.AdaTime)
    if (phase < 1 || phase > 60) {
      errors.AdaTime = t`ADA time must be between 1 to 60 seconds`
    }
  }
  // if (formData.subNodeNo !== '0' && !formData.LockOutput?.value) {
  //   errors.LockOutput = t`Lock output is required`
  // }
  if (!formData.UnlockTime) {
    errors.UnlockTime = t`Unlock time is required`
  }
  if (formData.UnlockTime) {
    // 1 to 60 seconds
    const phase = parseInt(formData.UnlockTime)
    if (phase < 1 || phase > 60) {
      errors.UnlockTime = t`Unlock time must be between 1 to 60 seconds`
    }
  }
  if (formData.ExtendedUnlock?.value === '1' && !formData.ExUnlockTime) {
    errors.ExUnlockTime = t`Extended unlock time is required`
  }
  if (formData.ExtendedUnlock?.value === '1' && formData.ExUnlockTime) {
    // 1 to 1440 minutes
    const phase = parseInt(formData.ExUnlockTime)
    if (phase < 1 || phase > 1440) {
      errors.ExUnlockTime = t`Extended unlock time must be between 1 to 1440 minutes`
    }
  }
  // if (formData.ThreatNo.length === 0) {
  //   errors.ThreatNo = t`At least one threat level is required`
  // }
  // if (!formData.ThreatLevel?.value) {
  //   errors.ThreatLevel = t`Threat level is required`
  // }

  // i am not sure are those are required or not
  if (formData.PairDoorEnable?.value === '1' && !formData.PairDoor?.value) {
    errors.PairDoor = t`Pair Door is required`
  }
  if (formData.ChannelEnable?.value === '1' && !formData.Channel?.value) {
    errors.Channel = t`Channel is required`
  }
  if (
    (formData.ForcedEnable?.value === '1' || formData.ProppedEnable?.value === '1') &&
    !formData.AlertOutput?.value
  ) {
    errors.AlertOutput = t`Alert Output is required`
  }
  if (formData.ShuntEnable?.value === '1' && !formData.ShuntOutput?.value) {
    errors.ShuntOutput = t`Shunt Output is required`
  }
  if (formData.BurgAlarmEnable?.value === '1' && !formData.BurgOutput?.value) {
    errors.BurgOutput = t`Burg Output is required`
  }
  if (formData.BurgAlarmEnable?.value === '1' && !formData.BurgInput?.value) {
    errors.BurgInput = t`Burg Input is required`
  }
  if (
    formData.BurgAlarmEnable?.value === '1' &&
    formData.BurgZoneEnable?.value === '1' &&
    !formData.BurgZoneInput?.value
  ) {
    errors.BurgZoneInput = t`Burg Zone Input is required`
  }
  if (formData.OccupancyEnable?.value === '1' && !formData.OccupancyInput?.value) {
    errors.OccupancyInput = t`Occupancy Input is required`
  }
  // -------------------------------------------------------------

  // if (formData.AntiPassbackRule?.value === '1' && !formData.AntiPassbackType?.value) {
  //   errors.AntiPassbackType = t`Anti-passback type is required`
  // }
  if (formData.AntiPassbackRule?.value === '1' && !formData.AntiPassbackTime) {
    errors.AntiPassbackTime = t`Anti Passback Time is required`
  }
  if (formData.AntiPassbackRule?.value === '1' && formData.AntiPassbackTime) {
    // 1 to 3600 seconds
    const phase = parseInt(formData.AntiPassbackTime)
    if (phase < 1 || phase > 3600) {
      errors.AntiPassbackTime = t`Anti Passback Time must be between 1 to 3600 seconds`
    }
  }
  return errors
}

export default validateDoorFormData
