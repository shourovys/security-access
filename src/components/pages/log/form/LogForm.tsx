import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { ILogFormData, logDeviceTypeObject } from '../../../../types/pages/log'
import { formatDateTimeTzView, formatDateTimeView } from '../../../../utils/formetTime'
import { LogIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: ILogFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function LogForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const checkExist = (key: keyof ILogFormData): boolean =>
    Boolean(
      formData &&
        formData[key] &&
        formData[key] !== '0' &&
        formData[key] !== 0 &&
        formData[key] !== ''
    )

  return (
    <FormCardWithHeader icon={LogIcon} header={t`Log`}>
      {checkExist('LogNo') && (
        <Input
          name="LogNo"
          label={t`Log No`}
          value={formData?.LogNo}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.LogNo}
          isLoading={isLoading}
        />
      )}

      {checkExist('Partition') && (
        <Input
          name="Partition"
          label={t`Partition`}
          value={formData?.Partition}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Partition}
          isLoading={isLoading}
        />
      )}

      {checkExist('LogTime') && (
        <Input
          name="LogTime"
          label={t`Log Time`}
          value={formatDateTimeTzView(formData?.LogTime || 0)}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.LogTime}
          isLoading={isLoading}
        />
      )}

      {checkExist('EventTime') && (
        <Input
          name="EventTime"
          label={t`Event Time`}
          value={formatDateTimeTzView(formData?.EventTime || 0)}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.EventTime}
          isLoading={isLoading}
        />
      )}

      {checkExist('EventCode') && (
        <Input
          name="EventCode"
          label={t`Event Code`}
          value={formData?.EventCode}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.EventCode}
          isLoading={isLoading}
        />
      )}

      {checkExist('EventName') && (
        <Input
          name="EventName"
          label={t`Event Name`}
          value={formData?.EventName}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.EventName}
          isLoading={isLoading}
        />
      )}

      {checkExist('DeviceType') && (
        <Input
          name="DeviceType"
          label={t`Device Type`}
          value={logDeviceTypeObject[formData?.DeviceType || '0']}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.DeviceType}
          isLoading={isLoading}
        />
      )}

      {checkExist('DeviceNo') && (
        <Input
          name="DeviceNo"
          label={t`Device No`}
          value={formData?.DeviceNo}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.DeviceNo}
          isLoading={isLoading}
        />
      )}

      {checkExist('DeviceName') && (
        <Input
          name="DeviceName"
          label={t`Device Name`}
          value={formData?.DeviceName}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.DeviceName}
          isLoading={isLoading}
        />
      )}

      {checkExist('FormatName') && (
        <Input
          name="FormatName"
          label={t`Format Name`}
          value={formData?.FormatName}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.FormatName}
          isLoading={isLoading}
        />
      )}

      {checkExist('CredentialNumb') && (
        <Input
          name="CredentialNumb"
          label={t`Credential Number`}
          value={formData?.CredentialNumb}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.CredentialNumb}
          isLoading={isLoading}
        />
      )}

      {checkExist('CredentialNo') && (
        <Input
          name="CredentialNo"
          label={t`Credential No`}
          value={formData?.CredentialNo}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.CredentialNo}
          isLoading={isLoading}
        />
      )}

      {checkExist('PersonNo') && (
        <Input
          name="PersonNo"
          label={t`Person No`}
          value={formData?.PersonNo}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.PersonNo}
          isLoading={isLoading}
        />
      )}

      {checkExist('PersonName') && (
        <Input
          name="PersonName"
          label={t`Person Name`}
          value={formData?.PersonName}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.PersonName}
          isLoading={isLoading}
        />
      )}

      {checkExist('ReaderPort') && (
        <Input
          name="ReaderPort"
          label={t`Reader Port`}
          value={formData?.ReaderPort == '1' ? t`In` : t`Out`}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ReaderPort}
          isLoading={isLoading}
        />
      )}

      {checkExist('RegionName') && (
        <Input
          name="RegionName"
          label={t`Region Name`}
          value={formData?.RegionName}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.RegionName}
          isLoading={isLoading}
        />
      )}

      {checkExist('ChannelName') && (
        <Input
          name="ChannelName"
          label={t`Channel Name`}
          value={formData?.ChannelName}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ChannelName}
          isLoading={isLoading}
        />
      )}

      {checkExist('Message') && (
        <Input
          name="Message"
          label={t`Message`}
          value={formData?.Message}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Message}
          isLoading={isLoading}
        />
      )}

      {checkExist('AckRequired') && (
        <Input
          name="AckRequired"
          label={t`Ack Required`}
          value={formData?.AckRequired ? t`Yes` : t`No`}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.AckRequired}
          isLoading={isLoading}
        />
      )}

      {checkExist('AckTime') && (
        <Input
          name="AckTime"
          label={t`Ack Time`}
          value={formatDateTimeTzView(formData?.AckTime || 0)}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.AckTime}
          isLoading={isLoading}
        />
      )}

      {checkExist('AckUser') && (
        <Input
          name="AckUser"
          label={t`Ack User`}
          value={formData?.AckUser}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.AckUser}
          isLoading={isLoading}
        />
      )}

      {checkExist('Comment') && (
        <Input
          name="Comment"
          label={t`Comment`}
          value={formData?.Comment}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Comment}
          isLoading={isLoading}
        />
      )}

      {/*{checkExist('LogSent') && (*/}
      {/*  <Input*/}
      {/*    name='LogSent'*/}
      {/*    label={t`Log Sent`}*/}
      {/*    value={formData?.LogSent}*/}
      {/*    onChange={handleInputChange}*/}
      {/*    disabled={disabled || typeof handleInputChange === 'undefined'}*/}
      {/*    error={formErrors?.LogSent}*/}
      {/*    isLoading={isLoading}*/}
      {/*  />*/}
      {/*)}*/}
    </FormCardWithHeader>
  )
}

export default LogForm
