import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { partitionApi } from '../../../api/urls'
import useAuth from '../../../hooks/useAuth'
import { allRoutesInGroup } from '../../../routes/menu'
import { THandleInputChange } from '../../../types/components/common'
import { INewFormErrors, ISingleServerResponse } from '../../../types/pages/common'
import { IFavoriteFormData, IPageInfo } from '../../../types/pages/favorite'
import { ILabeledRoute, ILabeledRoutes, IRoute, IRouteProperty } from '../../../types/routes'
import capitalize from '../../../utils/capitalize'
import checkPageLicense from '../../../utils/checkPageLicense'
import { favoriteIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import FormCardWithHeader from '../../HOC/FormCardWithHeader'
import PagesMultipleCheckbox from '../../common/form/PagesMultipleCheckbox'

interface IProps {
  formData?: IFavoriteFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IFavoriteFormData>
  disabled?: boolean
  isLoading?: boolean
  hasFavoritePage?: boolean
}

function UserRoleAuthorizationForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  hasFavoritePage,
}: IProps) {
  const { permissions, has_license, license, partition } = useAuth()

  const isDisabled = disabled || typeof handleInputChange === 'undefined'

  const { data: partitionPagesData, isLoading: partitionPagesIsLoading } = useSWR<
    ISingleServerResponse<IPageInfo[]>
  >(partitionApi.pages(partition?.PartitionNo.toString() || ''))

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

    const permittedLabeledRoutesIds = Object.keys(permittedLabeledRoutes).flatMap((routeType) =>
      permittedLabeledRoutes[routeType].map((route: ILabeledRoute) => route.id)
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

  useEffect(() => {
    if (!hasFavoritePage && handleInputChange) {
      handleInputChange('PageIds', allFilterPartitionPagesIdsRef.current)
    }
  }, [hasFavoritePage, allFilterPartitionPagesIdsRef.current])

  return (
    <FormCardWithHeader
      icon={favoriteIcon}
      header={t`Favorite`}
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
