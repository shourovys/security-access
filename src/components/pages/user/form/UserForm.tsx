import { partitionApi, personApi, userRoleApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { useParams } from 'react-router-dom'
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
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IUserFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function UserForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  // Get the user ID from the router query
  const params = useParams()
  const queryId = params.id as string

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
      : userRoleApi.list(
          `${SERVER_QUERY.selectorDataQuery}&PartitionNo=${formData?.Partition?.value}`
        )
  )

  const { isLoading: personIsLoading, data: personData } = useSWR<
    IListServerResponse<IPersonResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : personApi.list(
          `${SERVER_QUERY.selectorDataQuery}&PartitionNo=${formData?.Partition?.value}`
        )
  )

  return (
    <FormCardWithHeader icon={userIcon} header={t`User`}>
      {queryId !== '0' && showPartition && (
        <Selector
          name="Partition"
          label={t`Partition`}
          value={formData?.Partition}
          options={partitionData?.data.map((result) => ({
            value: result.PartitionNo.toString(),
            label: result.PartitionName,
          }))}
          isClearable={false}
          onChange={handleInputChange}
          disabled={
            disabled || typeof handleInputChange === 'undefined' || formData?.UserNo === '0'
          }
          error={formErrors?.Partition}
          isLoading={isLoading || partitionIsLoading}
        />
      )}

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
      {!(disabled || typeof handleInputChange === 'undefined') && (
        <Input
          name="Password"
          label={t`Password `}
          type="password"
          value={formData?.Password}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Password}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
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
      {queryId !== '0' && (
        <Selector
          name="Role"
          label={t`User Role`}
          value={formData?.Role}
          options={roleData?.data.map((result) => ({
            value: result.RoleNo.toString(),
            label: result.RoleName,
          }))}
          isClearable={false}
          onChange={handleInputChange}
          disabled={
            disabled || typeof handleInputChange === 'undefined' || formData?.UserNo === '0'
          }
          error={formErrors?.Role}
          isLoading={isLoading || roleIsLoading}
        />
      )}

      <Selector
        name="Person"
        label={t`Person`}
        value={formData?.Person}
        options={personData?.data.map((result) => ({
          value: result.PersonNo.toString(),
          label: `${result.FirstName} ${result.MiddleName} ${result.LastName}`,
        }))}
        isClearable={true}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Person}
        isLoading={isLoading || personIsLoading}
      />
    </FormCardWithHeader>
  )
}

export default UserForm
