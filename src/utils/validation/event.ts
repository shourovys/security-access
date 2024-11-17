import { INewFormErrors } from '../../types/pages/common'
import { IEventFormData } from '../../types/pages/eventAndAction'
import t from '../translator'

const validateEventFormData = (formData: IEventFormData): INewFormErrors<IEventFormData> => {
  const errors: INewFormErrors<IEventFormData> = {}

  if (!formData.EventType || !formData.EventType.value) {
    errors.EventType = t`Event Type is required`
  }
  // if (formData.EventCodes.length === 0) {
  //   errors.EventCodes = t`At least one Event Code is required`
  // }
  // if (formData.EventItemIds.length === 0) {
  //   errors.EventItemIds = t`At least one Event Item is required`
  // }

  return errors
}

export default validateEventFormData
