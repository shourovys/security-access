import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import { partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector, { TSelectValue } from '../../../../components/atomic/Selector'
import useAuth from '../../../../hooks/useAuth'
import { THandleInputChange } from '../../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../../types/pages/common'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IUserRoleFormData, IUserRoleInfoFormData } from '../../../../types/pages/userRole'
import { SERVER_QUERY } from '../../../../utils/config'
import { userRoleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IUserRoleFormData | IUserRoleInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IUserRoleFormData>
  disabled?: boolean
  isLoading?: boolean
}

function UserRoleForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  // const { permissions, has_license, license } = useAuth()
  // Get the userRole ID from the router query
  const params = useParams()
  const queryId = params.id as string

  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  // const { isLoading: partitionPagesIsLoading, data: partitionPagesData } = useSWR<
  //   ISingleServerResponse<IPageInfo[]>
  // >(formData?.Partition?.value ? partitionApi.pages(formData?.Partition?.value) : null)

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('PageIds', [])
    }
  }

  // const [filteredPartitionPagesData, setFilteredPartitionPagesData] = useState<IPageInfo[]>([])

  // useEffect(() => {
  //   if (partitionPagesData) {
  //     const filterAccessPages = partitionPagesData?.data?.filter((item) => {
  //       return permissions.find((permission) => permission.id == item.PageNo && permission.access)
  //     })

  //     const filterLicensePages = pagesLicenseFilter(filterAccessPages, license, has_license)

  //     setFilteredPartitionPagesData(filterLicensePages || [])
  //   }
  // }, [partitionPagesData, permissions])

  return (
    <FormCardWithHeader icon={userRoleIcon} header={t`User Role`}>
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
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Partition}
          isLoading={isLoading || partitionIsLoading}
        />
      )}
      <Input
        name="RoleName"
        label={t`Role Name `}
        value={formData?.RoleName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RoleName}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="RoleDesc"
        label={t`Description`}
        value={formData?.RoleDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RoleDesc}
        isLoading={isLoading}
      />
      {/* {(disabled || typeof handleInputChange === 'undefined') &&
        formData &&
        'Pages' in formData && (
          <Textarea
            name="PageIds"
            label={t`Role Page`}
            value={formData.Pages.map((page) => t(page.PageName)).join(', ')}
            row={6}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading}
          />
        )}

      {!(disabled || typeof handleInputChange === 'undefined') && queryId !== '0' && (
        <MultiSelect
          name="PageIds"
          label={t`Role Page `}
          value={formData?.PageIds}
          onChange={handleInputChange}
          options={filteredPartitionPagesData.map((item) => ({
            id: item.PageNo.toString(),
            label: t(item.PageName),
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.PageIds}
          isLoading={isLoading || partitionPagesIsLoading}
          gridColSpan2
          required={true} // modified by Imran
        />
      )} */}
    </FormCardWithHeader>
  )
}

export default UserRoleForm
