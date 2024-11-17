import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPutRequest } from '../../../api/swrConfig'
import { userRoleApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import UserRoleAuthorizationForm from '../../../components/pages/userrole/form/UserRoleAuthorizationForm'
import UserRoleForm from '../../../components/pages/userrole/form/UserRoleForm'
import useAuth from '../../../hooks/useAuth'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import { IUserRoleFormData, IUserRoleResult } from '../../../types/pages/userRole'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import pagesLicenseFilter from '../../../utils/pagesLicenseFilter'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../utils/toast'
import t from '../../../utils/translator'
import validateUserRoleFormData from '../../../utils/validation/userRole'

// Component to edit a UserRole
function EditUserRole() {
  const navigate = useNavigate()
  const { has_license, license } = useAuth()
  // Get the userRole ID from the router query
  const params = useParams()
  const queryId = params.id as string

  const auth = useAuth()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IUserRoleFormData>({
    RoleNo: 0,
    RoleName: '',
    RoleDesc: '',
    Partition: null,
    PageIds: [],
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IUserRoleFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch the details of the UserRole from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IUserRoleResult>>(
    queryId ? userRoleApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { RoleNo, RoleName, RoleDesc, Partition, Pages } = data.data

      const filteredPages = pagesLicenseFilter(Pages, license, has_license)

      setFormData({
        RoleNo,
        RoleName,
        RoleDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        PageIds: filteredPages.map((page) => page.PageNo.toString()),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(userRoleApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      auth.refresh()
      navigate(routeProperty.userRoleInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateUserRoleFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      //Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value)
      //   }
      // })
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      PartitionNo: formData.Partition?.value,
      RoleName: formData.RoleName,
      RoleDesc: formData.RoleDesc,
      PageIds: formData.PageIds,
    }

    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      color: 'apply',
      icon: applyIcon,
      text: t`Apply`,
      onClick: handleSubmit,
      isLoading: isMutating,
    },
    {
      color: 'cancel',
      icon: cancelIcon,
      text: t`Cancel`,
      link: routeProperty.userRoleInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer
        errorAlert={formErrors?.non_field_errors || formErrors?.PageIds}
        twoPart={queryId !== '0' && false}
      >
        <UserRoleForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
        />
        {queryId !== '0' && (
          <UserRoleAuthorizationForm
            formData={formData}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
            isLoading={isLoading}
          />
        )}
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.userRoleInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditUserRole
