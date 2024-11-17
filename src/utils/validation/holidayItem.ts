import { INewFormErrors } from '../../types/pages/common'
import { IHolidayItemFormData } from '../../types/pages/holidayItem'
import t from '../translator'

const validateHolidayItemFormData = (
  formData: IHolidayItemFormData
): INewFormErrors<IHolidayItemFormData> => {
  const errors: INewFormErrors<IHolidayItemFormData> = {}

  if (!formData.StartDate || !formData.EndDate) {
    errors.StartDate = t`Start & End Dates are required`
  }
  // if (!formData.EndDate) {
  //   errors.EndDate = t`End Date is required`
  // }
  if (!formData.DateName) {
    errors.DateName = t`Date Name is required`
  }

  return errors
}
export default validateHolidayItemFormData
