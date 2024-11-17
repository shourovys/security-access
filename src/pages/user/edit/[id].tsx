import { sendPutRequest } from '../../../api/swrConfig'
import { userApi, userRoleApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import UserForm from '../../../components/pages/user/form/UserForm'
import useAuth from '../../../hooks/useAuth'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IListServerResponse,
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import { IUserFormData, IUserResult } from '../../../types/pages/user'
import { IUserRoleResult } from '../../../types/pages/userRole'
import { SERVER_QUERY } from '../../../utils/config'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to edit a User
function EditUser() {
  const navigate = useNavigate()
  // Get the user ID from the router query
  const params = useParams()
  const queryId = params.id as string

  const auth = useAuth()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IUserFormData>({
    UserNo: '',
    UserId: '',
    Password: '',
    UserDesc: '',
    Email: '',
    Partition: null,
    Role: null,
    Person: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IUserFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch the details of the User from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IUserResult>>(
    queryId ? userApi.details(queryId) : null
  )
  useEffect(() => {
    if (data) {
      const { UserNo, UserId, UserDesc, Email, Role, Person, Partition } = data.data

      setFormData({
        UserNo: UserNo.toString(),
        UserId,
        Password: '',
        UserDesc,
        Email,
        Role: Role?.RoleName
          ? {
              value: Role.RoleNo.toString(),
              label: Role.RoleName,
            }
          : null,
        Person: Person?.LastName
          ? {
              value: Person.PersonNo.toString(),
              label: Person.LastName,
            }
          : null,
        Partition: Partition.PartitionName
          ? {
              value: Partition.PartitionNo.toString(),
              label: Partition.PartitionName,
            }
          : null,
      })
    }
  }, [data])

  const { data: userRoleData } = useSWR<IListServerResponse<IUserRoleResult[]>>(
    userRoleApi.list(SERVER_QUERY.selectorDataQuery)
  )

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    if (name === 'Partition' && value && typeof value === 'object' && 'value' in value) {
      const selectedPartitionRole = userRoleData?.data?.find(
        (role) => role.Partition.PartitionNo.toString() === value.value
      )
      setFormData(
        (state) =>
          ({
            ...state,
            [name]: value,
            Role: selectedPartitionRole
              ? {
                  label: selectedPartitionRole?.RoleName,
                  value: selectedPartitionRole?.RoleNo.toString(),
                }
              : null,
            Person: null,
          }) as IUserFormData
      )
    } else {
      setFormData((state) => ({ ...state, [name]: value }))
    }
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(userApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      auth.refresh()
      navigate(routeProperty.userInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: INewFormErrors<IUserFormData> = {}
    if (!formData.UserId) {
      errors.UserId = t`User ID is required`
    }
    // if (!formData.Email) {
    //   errors.Email= t`Email is required`
    // }
    if (!formData.Password) {
      errors.Password = t`Password is required`
    }
    if (!formData.Role?.value) {
      errors.Role = t`Role is required`
    }
    // if (!formData.Person?.value) {
    //   errors.Person= t`Person is required`
    // }
    if (!formData.Partition?.value) {
      errors.Partition = t`Partition is required`
    }

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
      UserId: formData.UserId,
      Password: formData.Password,
      UserDesc: formData.UserDesc,
      Email: formData.Email,
      PartitionNo: formData.Partition?.value,
      RoleNo: formData.Role?.value,
      PersonNo: formData.Person?.value,
    }
    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar

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
      link: routeProperty.userInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <UserForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.userInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditUser
