import { IFormErrors } from '../../types/pages/common'
import { IRegionFormData } from '../../types/pages/region'
import t from '../translator'

const validateRegionFormData = (formData: IRegionFormData): IFormErrors => {
  const errors: IFormErrors = {}

  if (!formData.RegionName) {
    errors.RegionName = t`Name is required`
  }

  // if (
  //   !formData.OnlyMuster?.value &&
  //   !formData.AntiPassbackRule?.value &&
  //   !formData.AntiTailgateRule?.value &&
  //   !formData.OccupancyRule?.value &&
  //   !formData.DeadmanRule?.value &&
  //   !formData.HazmatRule?.value
  // ) {
  //   errors.rule = t`At least one rule must be selected`
  // }

  if (formData.AntiPassbackRule?.value !== '0' && !formData.AntiPassbackTime) {
    errors.AntiPassbackTime = t`Anti-passback time is required`
  }

  if (formData.DeadmanRule?.value !== '0' && !formData.DeadmanInterval) {
    errors.DeadmanInterval = t`Deadman interval is required`
  }
  if (formData.DeadmanRule?.value !== '0' && !formData.DeadmanOutputNo) {
    errors.DeadmanOutputNo = t`Deadman output number is required`
  }

  if (formData.OccupancyRule?.value !== '0' && !formData.OccupancyLimit) {
    errors.OccupancyLimit = t`Occupancy limit is required`
  }

  if (formData.HazmatRule?.value !== '0' && !formData.HazmatInputNo) {
    errors.HazmatInputNo = t`Hazardous material input number is required`
  }

  if (formData.HazmatRule?.value !== '0' && !formData.HazmatOutputNo) {
    errors.HazmatOutputNo = t`Hazardous material output number is required`
  }

  if (formData.ResetDaily?.value !== '0' && !formData.ResetTime) {
    errors.ResetTime = t`Reset time is required`
  }

  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }

  return errors
}

export default validateRegionFormData
