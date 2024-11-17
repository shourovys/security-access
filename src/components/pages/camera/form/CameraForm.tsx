import { nodeApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import {
  ICameraFormData,
  ICameraInfoFormData,
  recordStatOptions,
} from '../../../../types/pages/camera'
import {
  IFormErrors,
  IListServerResponse,
  booleanSelectOption,
} from '../../../../types/pages/common'
import { INodeResult } from '../../../../types/pages/node'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { cameraIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: ICameraFormData | ICameraInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function CameraForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
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

  // const { isLoading: userIsLoading, data: userData } = useSWR<
  //   IListServerResponse<IUserResult[]>
  // >(
  //   disabled || typeof handleInputChange === 'undefined'
  //     ? null
  //     : userApi.list(SERVER_QUERY.selectorDataQuery)
  // )

  return (
    <FormCardWithHeader icon={cameraIcon} header={t`Camera`}>
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
        name="CameraName"
        // placeholder="Camera Name"
        label={t`Camera Name `}
        value={formData?.CameraName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.CameraName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="CameraDesc"
        label={t`Description`}
        value={formData?.CameraDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.CameraDesc}
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
        name="CameraPort"
        // placeholder="Camera Port"
        label={t`Camera Port `}
        value={formData?.CameraPort}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        type="number"
        error={formErrors?.CameraPort}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="MainUrl"
        label={t`Main URL `}
        // placeholder="https://www.example.com"
        value={formData?.MainUrl}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        type="text"
        error={formErrors?.MainUrl}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="SubUrl"
        label={t`Sub URL `}
        // placeholder="https://www.example.com"
        value={formData?.SubUrl}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        type="text"
        error={formErrors?.SubUrl}
        isLoading={isLoading}
        required={true}
      />
      {/* <Selector
        name="user"
        label={t`User ID`}
        value={formData?.User}
        options={userData?.data.map((result) => ({
          value: result.UserId.toString(),
          label: result.UserName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.User}
        isLoading={isLoading || userIsLoading}
      /> */}
      <Input
        name="UserId"
        // placeholder="User ID"
        label={t`User ID `}
        value={formData?.UserId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.UserId}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="Password"
        // placeholder="Password"
        label={t`Password `}
        value={formData?.Password}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        type="password"
        error={formErrors?.Password}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="PreTime"
        // placeholder="Pre-Event Record Time"
        label={t`Pre-Event Record Time (sec) `}
        value={formData?.PreTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        type="number"
        error={formErrors?.PreTime}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="PostTime"
        // placeholder="Post-Event Record Time"
        label={t`Post-Event Record Time (sec) `}
        value={formData?.PostTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        type="number"
        error={formErrors?.PostTime}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="MinTime"
        // placeholder="Minimum Record Time"
        label={t`Minimum Record Time (min) `}
        value={formData?.MinTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        type="number"
        error={formErrors?.MinTime}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="MaxTime"
        // placeholder="Maximum Record Time"
        label={t`Maximum Record Time (day) `}
        value={formData?.MaxTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        type="number"
        error={formErrors?.MaxTime}
        isLoading={isLoading}
        required={true}
      />
      {formData &&
        'RecordStat' in formData &&
        (disabled || typeof handleInputChange === 'undefined') && (
          <Selector
            name="RecordStat"
            label={t`Record Stat`}
            value={formData?.RecordStat}
            options={recordStatOptions}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.RecordStat}
            isLoading={isLoading}
          />
        )}
      {formData &&
        'Online' in formData &&
        (disabled || typeof handleInputChange === 'undefined') && (
          <Selector
            name="Online"
            label={t`Online`}
            value={formData?.Online}
            options={booleanSelectOption}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Online}
            isLoading={isLoading}
          />
        )}
    </FormCardWithHeader>
  )
}

export default CameraForm
