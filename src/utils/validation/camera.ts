import { ICameraFormData } from '../../types/pages/camera'
import { INewFormErrors } from '../../types/pages/common'
import t from '../translator'

const validateCameraFormData = (formData: ICameraFormData): INewFormErrors<ICameraFormData> => {
  const errors: INewFormErrors<ICameraFormData> = {}
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  if (!formData.Node?.value) {
    errors.Node = t`Node is required`
  }
  if (!formData.UserId) {
    errors.UserId = t`User is required`
  }
  if (!formData.CameraName) {
    errors.CameraName = t`Name is required`
  }
  if (formData.CameraPort === '') {
    errors.CameraPort = t`Port is required`
  }
  if (formData.MainUrl === '') {
    errors.MainUrl = t`Main url is required`
  }
  if (formData.SubUrl === '') {
    errors.SubUrl = t`Sub url is required`
  }
  if (!formData.Password) {
    errors.Password = t`Password is required`
  }
  if (formData.PreTime === '') {
    errors.PreTime = t`Pre time is required`
  }
  if (formData.PostTime === '') {
    errors.PostTime = t`Post time is required`
  }
  if (formData.MinTime === '') {
    errors.MinTime = t`Min time is required`
  }
  if (formData.MaxTime === '') {
    errors.MaxTime = t`Max time is required`
  }

  return errors
}

export default validateCameraFormData
