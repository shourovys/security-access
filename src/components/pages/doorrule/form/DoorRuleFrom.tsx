import useSWR from 'swr'
import { doorApi, partitionApi, scheduleApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorResult } from '../../../../types/pages/door'
import { IDoorRuleFormData, doorRuleTypeOption } from '../../../../types/pages/doorRule'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IScheduleResult } from '../../../../types/pages/schedule'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorRuleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'
interface IProps {
  formData: IDoorRuleFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function DoorRuleForm({ formData, formErrors, handleInputChange, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: scheduleIsLoading, data: scheduleData } = useSWR<
    IListServerResponse<IScheduleResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : scheduleApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: doorIsLoading, data: doorData } = useSWR<IListServerResponse<IDoorResult[]>>(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : doorApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={doorRuleIcon} header={t`Door Rule`}>
      {showPartition && (
        <Selector
          name="Partition"
          label={t`Partition`}
          value={formData.Partition}
          options={partitionData?.data.map((result) => ({
            value: result.PartitionNo.toString(),
            label: result.PartitionName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading || partitionIsLoading}
          error={formErrors?.Partition}
        />
      )}
      <Input
        name="RuleName"
        label={t`Door Rule Name `}
        value={formData.RuleName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RuleName}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="RuleDesc"
        label={t`Description`}
        value={formData.RuleDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RuleDesc}
        isLoading={isLoading}
      />
      <Selector
        name="RuleType"
        label={t`Rule Type`}
        value={formData.RuleType}
        options={doorRuleTypeOption}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RuleType}
        isLoading={isLoading}
      />
      {/* <Selector
        name="Door"
        label={t`Door`}
        value={formData.Door}
        options={doorData?.data.map((result) => ({
          value: result.DoorNo.toString(),
          label: result.DoorName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Door}
        isLoading={isLoading || doorIsLoading}
      /> */}
      <Selector
        name="Schedule"
        label={t`Schedule`}
        value={formData.Schedule}
        options={scheduleData?.data.map((result) => ({
          value: result.ScheduleNo.toString(),
          label: result.ScheduleName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading || scheduleIsLoading}
        error={formErrors?.Schedule}
      />

      {formData.RuleType?.value === '1' && (
        <Input
          name="GraceTime"
          label={t`Grace Time (min)`}
          type="number"
          value={formData.GraceTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.GraceTime}
          isLoading={isLoading}
          required={true}
        />
      )}
      {formData.RuleType?.value === '3' && (
        <Input
          name="CardTime"
          label={t`Card Time (sec)`}
          type="number"
          value={formData.CardTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.CardTime}
          isLoading={isLoading}
          required={true}
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorRuleForm
