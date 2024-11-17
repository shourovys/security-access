import useSWR from 'swr'
import { partitionApi, threatApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import MultipleCheckbox from '../../../../components/atomic/MultipleCheckbox'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange, THandleInputSelect } from '../../../../types/components/common'
import {
  IListServerResponse,
  INewFormErrors,
  ISelectedInputFields,
} from '../../../../types/pages/common'
// import { IDoorResult } from 'types/pages/door'
import {
  IDoorGroupEditFormData,
  doorLockTypeOption,
  doorReaderTypeOption,
  doorRexAndContactTypeOption,
  doorThreatLevelOption,
} from '../../../../types/pages/door'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IThreatResult } from '../../../../types/pages/threat'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
interface IProps {
  formData: IDoorGroupEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IDoorGroupEditFormData>
  disabled?: boolean
  isLoading?: boolean
  // props for checkbox in header
  selectedFields?: ISelectedInputFields<IDoorGroupEditFormData>
  handleSelect?: THandleInputSelect
}

function DoorGroupEditForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  selectedFields,
  handleSelect,
}: IProps) {
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: threatIsLoading, data: threatData } = useSWR<
    IListServerResponse<IThreatResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : threatApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader
      icon={doorIcon}
      header={t`Group Edit`}
      selectName="Door"
      isSelected={
        selectedFields?.Partition &&
        selectedFields?.InEnable &&
        selectedFields?.InType &&
        selectedFields?.OutEnable &&
        selectedFields?.OutType &&
        selectedFields?.ContactEnable &&
        selectedFields?.ContactType &&
        selectedFields?.ProppedTime &&
        selectedFields?.AdaTime &&
        selectedFields?.RexEnable &&
        selectedFields?.RexType &&
        selectedFields?.LockType &&
        selectedFields?.RelockOnOpen &&
        selectedFields?.UnlockTime &&
        selectedFields?.ExtendedUnlock &&
        selectedFields?.ExUnlockTime &&
        selectedFields?.Threat &&
        selectedFields?.ThreatLevel &&
        selectedFields?.ThreatIgnoreRex
      }
      handleSelect={handleSelect}
    >
      <Selector
        name="Partition"
        label={t`Partition`}
        value={formData.Partition}
        options={partitionData?.data.map((result) => ({
          value: result.PartitionNo.toString(),
          label: result.PartitionName,
        }))}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Partition}
        isLoading={isLoading || partitionIsLoading}
        isSelected={selectedFields?.Partition}
        handleSelect={handleSelect}
      />

      <SwitchButtonSelect
        name="InEnable"
        label={t`Reader In Enable`}
        value={formData?.InEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        // error={formErrors?.ReaderInEnable}
        isLoading={isLoading}
        isSelected={selectedFields?.InEnable}
        handleSelect={handleSelect}
      />

      <Selector
        name="InType"
        label={t`Reader In Type`}
        value={formData?.InType}
        options={doorReaderTypeOption}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InType}
        isLoading={isLoading}
        isSelected={selectedFields?.InType}
        handleSelect={handleSelect}
      />

      <SwitchButtonSelect
        name="OutEnable"
        label={t`Reader Out Enable`}
        value={formData?.OutEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        // error={formErrors?.ReaderOutEnable}
        isLoading={isLoading}
        isSelected={selectedFields?.OutEnable}
        handleSelect={handleSelect}
      />

      <Selector
        name="OutType"
        label={t`Reader Out Type`}
        value={formData?.OutType}
        options={doorReaderTypeOption}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.OutType}
        isLoading={isLoading}
        isSelected={selectedFields?.OutType}
        handleSelect={handleSelect}
      />

      <SwitchButtonSelect
        name="ContactEnable"
        label={t`Door Contact Enable`}
        value={formData?.ContactEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        // error={formErrors?.DoorContactEnable}
        isLoading={isLoading}
        isSelected={selectedFields?.ContactEnable}
        handleSelect={handleSelect}
      />

      <Selector
        name="ContactType"
        label={t`Door Contact Type`}
        value={formData?.ContactType}
        onChange={handleInputChange}
        options={doorRexAndContactTypeOption}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ContactType}
        isLoading={isLoading}
        isSelected={selectedFields?.ContactType}
        handleSelect={handleSelect}
      />

      <Input
        name="ProppedTime"
        label={t`Propped Time (sec)`}
        type="number"
        value={formData?.ProppedTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ProppedTime}
        isLoading={isLoading}
        isSelected={selectedFields?.ProppedTime}
        handleSelect={handleSelect}
      />

      <Input
        name="AdaTime"
        label={t`ADA Time (sec)`}
        type="number"
        value={formData?.AdaTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.AdaTime}
        isLoading={isLoading}
        isSelected={selectedFields?.AdaTime}
        handleSelect={handleSelect}
      />

      <SwitchButtonSelect
        name="RexEnable"
        label={t`Door Rex Enable`}
        value={formData?.RexEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        // error={formErrors?.RexEnable}
        isLoading={isLoading}
        isSelected={selectedFields?.RexEnable}
        handleSelect={handleSelect}
      />

      <Selector
        name="RexType"
        label={t`Door Rex Type`}
        value={formData?.RexType}
        onChange={handleInputChange}
        options={doorRexAndContactTypeOption}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RexType}
        isLoading={isLoading}
        isSelected={selectedFields?.RexType}
        handleSelect={handleSelect}
      />

      <Selector
        name="LockType"
        label={t`Door Lock Type`}
        value={formData?.LockType}
        options={doorLockTypeOption}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.LockType}
        isLoading={isLoading}
        isSelected={selectedFields?.LockType}
        handleSelect={handleSelect}
      />

      <SwitchButtonSelect
        name="RelockOnOpen"
        label={t`Relock On Open`}
        value={formData?.RelockOnOpen}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        // error={formErrors?.RelockOnOpen}
        isLoading={isLoading}
        isSelected={selectedFields?.RelockOnOpen}
        handleSelect={handleSelect}
      />

      <Input
        name="UnlockTime"
        label={t`Unlock Time (sec)`}
        type="number"
        value={formData?.UnlockTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.UnlockTime}
        isLoading={isLoading}
        isSelected={selectedFields?.UnlockTime}
        handleSelect={handleSelect}
      />

      <SwitchButtonSelect
        name="ExtendedUnlock"
        label={t`Extended Unlock`}
        value={formData?.ExtendedUnlock}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        // error={formErrors?.ExtendedUnlock}
        isLoading={isLoading}
        isSelected={selectedFields?.ExtendedUnlock}
        handleSelect={handleSelect}
      />

      <Input
        name="ExUnlockTime"
        label={t`Extended Unlock Time (sec)`}
        type="number"
        value={formData?.ExUnlockTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ExUnlockTime}
        isLoading={isLoading}
        isSelected={selectedFields?.ExUnlockTime}
        handleSelect={handleSelect}
      />

      <Selector
        name="Threat"
        label="Threat"
        value={formData?.Threat}
        options={threatData?.data.map((result) => ({
          value: result.ThreatNo.toString(),
          label: result.ThreatName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Threat}
        isLoading={isLoading || threatIsLoading}
        handleSelect={handleSelect}
      />

      <Selector
        name="ThreatLevel"
        label={t`Threat Level`}
        value={formData?.ThreatLevel}
        options={doorThreatLevelOption}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ThreatLevel}
        isLoading={isLoading}
        isSelected={selectedFields?.ThreatLevel}
        handleSelect={handleSelect}
      />

      <SwitchButtonSelect
        name="ThreatIgnoreRex"
        label={t`Threat Ignore Rex`}
        value={formData?.ThreatIgnoreRex}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        // error={formErrors?.ThreatIgnoreRex}
        isLoading={isLoading}
        isSelected={selectedFields?.ThreatIgnoreRex}
        handleSelect={handleSelect}
      />
    </FormCardWithHeader>
  )
}

export default DoorGroupEditForm
