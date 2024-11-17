import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { partitionApi } from '../../../../api/urls'
import useAuth from '../../../../hooks/useAuth'
import { allRoutesInGroup } from '../../../../routes/menu'
import { THandleInputChange } from '../../../../types/components/common'
import { INewFormErrors, ISingleServerResponse } from '../../../../types/pages/common'
import { IPageInfo } from '../../../../types/pages/favorite'
import { IUserRoleFormData, IUserRoleInfoFormData } from '../../../../types/pages/userRole'
import { ILabeledRoute, ILabeledRoutes, IRoute, IRouteProperty } from '../../../../types/routes'
import capitalize from '../../../../utils/capitalize'
import checkPageLicense from '../../../../utils/checkPageLicense'
import { userRoleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import FormCardWithHeader from '../../../HOC/FormCardWithHeader'
import PagesMultipleCheckbox from '../../../common/form/PagesMultipleCheckbox'

interface IProps {
  formData?: IUserRoleFormData | IUserRoleInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IUserRoleFormData>
  disabled?: boolean
  isLoading?: boolean
}

function UserRoleAuthorizationForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const { permissions, has_license, license } = useAuth()

  const isDisabled = disabled || typeof handleInputChange === 'undefined'

  const { data: partitionPagesData, isLoading: partitionPagesIsLoading } = useSWR<
    ISingleServerResponse<IPageInfo[]>
  >(formData?.Partition?.value ? partitionApi.pages(formData?.Partition?.value) : null)

  const [filteredPartitionPagesData, setFilteredPartitionPagesData] = useState<ILabeledRoutes>({})
  const allFilterPartitionPagesIdsRef = useRef<string[]>([])

  useEffect(() => {
    if (!partitionPagesData) return

    const permittedLabeledRoutes: ILabeledRoutes = Object.entries(allRoutesInGroup).reduce(
      (acc: ILabeledRoutes, [key, value]: [string, IRouteProperty]) => {
        const labeledRoute = Object.values(value).filter((obj: IRoute) => {
          const pageId = obj.id ? String(obj.id) : ''
          return (
            Object.prototype.hasOwnProperty.call(obj, 'label') &&
            partitionPagesData.data?.find(
              (partitionPage) => String(partitionPage.PageNo) === pageId
            ) &&
            permissions.some(
              (permission) => String(permission.id) === pageId && permission.access
            ) &&
            checkPageLicense(Number(pageId), license, has_license)
          )
        }) as ILabeledRoute[]

        if (labeledRoute.length) acc[key] = labeledRoute
        return acc
      },
      {}
    )

    const permittedLabeledRoutesIds = Object.values(permittedLabeledRoutes).reduce(
      (acc: string[], routes) => {
        const routeIds = routes.map((route: ILabeledRoute) => route.id)
        return [...acc, ...routeIds]
      },
      []
    )

    setFilteredPartitionPagesData(permittedLabeledRoutes)

    allFilterPartitionPagesIdsRef.current = permittedLabeledRoutesIds
  }, [partitionPagesData, permissions, has_license, license])

  const handlePageCheckboxChange = (name: string, value: string[]) => {
    if (handleInputChange) {
      handleInputChange(name, value)
    }
  }
  const handleGroupCheckboxChange = (name: string, checked: boolean) => {
    if (handleInputChange) {
      const groupPageIds = filteredPartitionPagesData[name].map((route: ILabeledRoute) => route.id)
      handleInputChange(
        'PageIds',
        checked
          ? formData?.PageIds
            ? [...formData.PageIds, ...groupPageIds]
            : groupPageIds
          : formData?.PageIds.filter((pageId) => !groupPageIds.includes(pageId))
      )
    }
  }
  const handleHeaderCheckboxChange = (name: string, checked: boolean) => {
    if (handleInputChange) {
      handleInputChange('PageIds', checked ? allFilterPartitionPagesIdsRef.current : [])
    }
  }

  return (
    <FormCardWithHeader
      icon={userRoleIcon}
      header={t`Authorization`}
      twoPart={false}
      isSelected={formData?.PageIds?.length === allFilterPartitionPagesIdsRef.current.length}
      handleSelect={isDisabled ? undefined : handleHeaderCheckboxChange}
    >
      {Object.keys(filteredPartitionPagesData).map((routeType, index) => (
        <div className="border-b last:border-b-0 pb-2" key={routeType + index}>
          <PagesMultipleCheckbox
            key={index}
            name={`PageIds`}
            groupName={routeType}
            inputLabel={t(capitalize(routeType))}
            checkboxData={filteredPartitionPagesData[routeType].map((route: ILabeledRoute) => ({
              label: t`${route.label}`,
              value: route.id,
            }))}
            checked={formData?.PageIds}
            onChange={handlePageCheckboxChange}
            isSelected={filteredPartitionPagesData[routeType].every(
              (route) => formData?.PageIds.includes(route.id)
            )}
            handleSelect={isDisabled ? undefined : handleGroupCheckboxChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            // error={formErrors?.PageIds}
            isLoading={isLoading || partitionPagesIsLoading}
          />
        </div>
      ))}
    </FormCardWithHeader>
  )
}

export default UserRoleAuthorizationForm
