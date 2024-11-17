import { IFormErrors, INewFormErrors } from '../../types/pages/common'
import { IIntercomFormData } from '../../types/pages/intercom'
import t from '../../utils/translator'

const validateIntercomFormData = (
  formData: IIntercomFormData
): INewFormErrors<IIntercomFormData> => {
  const errors: IFormErrors = {}

  if (!formData.IntercomName) {
    errors.IntercomName = t`Intercom Name is required`
  }

  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }

  if (!formData.Node?.value) {
    errors.Node = t`Node is required`
  }

  if (!formData.UserId) {
    errors.UserId = t`User ID is required`
  }

  if (!formData.IpAddress) {
    errors.IpAddress = t`IP Address is required`
  }

  if (!formData.ApiPort) {
    errors.ApiPort = t`API Port is required`
  }

  if (!formData.Password) {
    errors.Password = t`Password is required`
  }

  if (!formData.DeviceId) {
    errors.DeviceId = t`Device ID is required`
  }

  if (!formData.OpenDoorWay) {
    errors.OpenDoorWay = t`Open Door Way is required`
  }

  if (formData.GateType?.value !== '0' && formData.GateType?.value !== '1') {
    if (!formData.FaceThreshold) {
      errors.FaceThreshold = t`Face Threshold is required`
    }
  }

  if (!formData.VerifyMode) {
    errors.VerifyMode = t`Verify Mode is required`
  }

  if (formData.GateType?.value !== '0' && formData.GateType?.value !== '2') {
    // Check SIP fields if GateType is 2 (Basic+Face) or 3 (Basic+Intercom and Face)
    if (!formData.SipGateId) {
      errors.SipGateId = t`SIP Gate ID is required`
    }

    if (!formData.SipPassword) {
      errors.SipPassword = t`SIP Password is required`
    }

    if (!formData.SipOperatorId) {
      errors.SipOperatorId = t`SIP Operator ID is required`
    }

    if (!formData.SipDtmfLock) {
      errors.SipDtmfLock = t`SIP DTMF Lock is required`
    }

    // if (!formData.SipIncomingCall) {
    //   errors.SipIncomingCall = t`SIP Incoming Call is required`
    // }
  }

  return errors
}

export default validateIntercomFormData
