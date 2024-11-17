import { nodeApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import {
  IFacegateFormData,
  IFacegateInfoFromData,
  facegateGateTypeOptions,
  facegateOpenDoorWayOptions,
  facegateVerifyModeOptions,
} from '../../../../types/pages/facegate'
import { INodeResult } from '../../../../types/pages/node'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'

import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IFacegateFormData | IFacegateInfoFromData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function FacegateForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  // useEffect(() => {
  //   if (formData?.GateType?.value === '0' || formData?.GateType?.value === '1') {
  //     handleInputChange?.('SipGateId', '')
  //     handleInputChange?.('SipPassword', '')
  //     handleInputChange?.('SipOperatorId', '')
  //     handleInputChange?.('SipDtmfLock', '')
  //     handleInputChange?.('SipIncomingCall', null)
  //   }
  // }, [formData?.GateType])

  const isGateTypeNot0or2 = formData?.GateType?.value !== '0' && formData?.GateType?.value !== '2'
  const isInfoPage =
    (disabled || typeof handleInputChange === 'undefined') && formData && 'Online' in formData

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Facegate`}>
      {showPartition && (
        <Selector
          name="Partition"
          label={t`Partition`}
          value={formData?.Partition}
          options={partitionData?.data.map((result) => ({
            value: result.PartitionNo.toString(),
            label: result.PartitionName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Partition}
          isLoading={isLoading || partitionIsLoading}
        />
      )}
      <Input
        name="FacegateName"
        label={t`Facegate Name `}
        value={formData?.FacegateName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.FacegateName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="FacegateDesc"
        label={t`Description`}
        value={formData?.FacegateDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.FacegateDesc}
        isLoading={isLoading}
      />
      <Selector
        name="Node"
        label={t`Node`}
        value={formData?.Node}
        options={nodeData?.data.map((result) => ({
          value: result.NodeNo.toString(),
          label: result.NodeName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Node}
        isLoading={isLoading || nodeIsLoading}
        required={true}
      />
      <Input
        name="IpAddress"
        label={t`IP Address `}
        value={formData?.IpAddress}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.IpAddress}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="ApiPort"
        type="number"
        label={t`API Port `}
        value={formData?.ApiPort}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ApiPort}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="UserId"
        label={t`User ID `}
        value={formData?.UserId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.UserId}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="Password"
        label={t`Password `}
        value={formData?.Password}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Password}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="DeviceId"
        label={t`Device ID `}
        value={formData?.DeviceId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.DeviceId}
        isLoading={isLoading}
        required={true} // modified by Imran
      />

      <Selector
        name="OpenDoorWay"
        label={t`Open Door Way`}
        value={formData?.OpenDoorWay}
        options={facegateOpenDoorWayOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.OpenDoorWay}
        isLoading={isLoading}
      />

      <Selector
        name="GateType"
        label={t`Gate Type`}
        value={formData?.GateType}
        options={facegateGateTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.GateType}
        isLoading={isLoading}
      />

      <Selector
        name="VerifyMode"
        label={t`Verify Mode`}
        value={formData?.VerifyMode}
        options={facegateVerifyModeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.VerifyMode}
        isLoading={isLoading}
      />

      {formData?.GateType?.value !== '0' && formData?.GateType?.value !== '1' && (
        <Input
          name="FaceThreshold"
          type="number"
          label={t`Face Threshold`}
          value={formData?.FaceThreshold}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.FaceThreshold}
          isLoading={isLoading}
          required={true}
        />
      )}
      {isGateTypeNot0or2 && (
        <Input
          name="SipGateId"
          label={t`SIP Gate ID`}
          value={formData?.SipGateId}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.SipGateId}
          isLoading={isLoading}
          required={true}
        />
      )}
      {isGateTypeNot0or2 && (
        <Input
          name="SipPassword"
          label={t`SIP Password`}
          value={formData?.SipPassword}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.SipPassword}
          isLoading={isLoading}
          required={true}
        />
      )}
      {isGateTypeNot0or2 && (
        <Input
          name="SipOperatorId"
          label={t`SIP Operator ID`}
          value={formData?.SipOperatorId}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.SipOperatorId}
          isLoading={isLoading}
          required={true}
        />
      )}
      {isGateTypeNot0or2 && (
        <Input
          name="SipDtmfLock"
          type="number"
          label={t`SIP DTMF Lock`}
          value={formData?.SipDtmfLock}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.SipDtmfLock}
          isLoading={isLoading}
          required={true}
        />
      )}
      {isGateTypeNot0or2 && (
        <SwitchButtonSelect
          name="SipIncomingCall"
          label={t`Sip Incoming Call`}
          value={formData?.SipIncomingCall}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
      )}
      {isInfoPage && (
        <Input
          name="Online"
          label={t`Online`}
          value={formData?.Online}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Online}
          isLoading={isLoading}
        />
      )}
      {isInfoPage && (
        <Input
          name="Busy"
          label={t`Busy`}
          value={formData?.Busy}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Busy}
          isLoading={isLoading}
        />
      )}
      {isInfoPage && (
        <Input
          name="LockStat"
          label={t`Lock Stat`}
          value={formData?.LockStat}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.LockStat}
          isLoading={isLoading}
        />
      )}
      {/* {isInfoPage && (
        <Input
          name="ContactStat"
          label={t`Contact Stat`}
          value={formData?.ContactStat}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ContactStat}
          isLoading={isLoading}
        />
      )} */}
    </FormCardWithHeader>
  )
}

export default FacegateForm
