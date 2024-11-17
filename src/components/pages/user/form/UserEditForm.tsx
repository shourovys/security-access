import { partitionApi, personApi, userRoleApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IPersonResult } from '../../../../types/pages/person'
import { IUserFormData } from '../../../../types/pages/user'
import { IUserRoleResult } from '../../../../types/pages/userRole'
import { SERVER_QUERY } from '../../../../utils/config'
import { userIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IUserFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function UserEditForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: roleIsLoading, data: roleData } = useSWR<
    IListServerResponse<IUserRoleResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : userRoleApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: personIsLoading, data: personData } = useSWR<
    IListServerResponse<IPersonResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : personApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={userIcon} header={t`User`}>
      <Selector
        name="Partition"
        label={t`Partition`}
        value={formData?.Partition}
        options={partitionData?.data.map((result) => ({
          value: result.PartitionNo.toString(),
          label: result.PartitionDesc,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Partition}
        isLoading={isLoading || partitionIsLoading}
      />
      <Input
        name="UserId"
        label={t`User ID`}
        value={formData?.UserId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.UserId}
        isLoading={isLoading}
      />
      <Input
        name="Password"
        label={t`Password`}
        type="password"
        value={formData?.Password}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Password}
        isLoading={isLoading}
      />
      <Input
        name="UserDesc"
        label={t`Description`}
        value={formData?.UserDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.UserDesc}
        isLoading={isLoading}
      />
      <Input
        name="Email"
        label={t`Email`}
        value={formData?.Email}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Email}
        isLoading={isLoading}
      />
      <Selector
        name="Role"
        label={t`User Role`}
        value={formData?.Role}
        options={roleData?.data.map((result) => ({
          value: result.RoleNo.toString(),
          label: result.RoleName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Role}
        isLoading={isLoading || roleIsLoading}
      />
      <Selector
        name="Person"
        label={t`Person`}
        value={formData?.Person}
        options={personData?.data.map((result) => ({
          value: result.PersonNo.toString(),
          label: result.LastName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Person}
        isLoading={isLoading || personIsLoading}
      />
    </FormCardWithHeader>
  )
}

export default UserEditForm
