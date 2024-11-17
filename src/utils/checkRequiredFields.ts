import { INewFormErrors } from '../types/pages/common'

function checkRequiredFields<T>(fields: (keyof T)[], formData: T): INewFormErrors<T> {
  const errors: INewFormErrors<T> = {}

  fields.forEach((field) => {
    const value = formData[field]
    if (!value) {
      errors[field] = `${field.toString()} is required` as INewFormErrors<T>[keyof T]
    } else if (typeof value === 'object' && 'value' in value && !value.value) {
      errors[field] = `${field.toString()} is required` as INewFormErrors<T>[keyof T]
    } else if (typeof value === 'string' && !value.trim()) {
      errors[field] = `${field.toString()} is required` as INewFormErrors<T>[keyof T]
    } else if (typeof value === 'object' && Array.isArray(value) && !value.length) {
      errors[field] = `${field.toString()} is required` as INewFormErrors<T>[keyof T]
    }
  })

  return errors
}

export default checkRequiredFields
