import { sendPostRequest } from '../../api/swrConfig'
import { userApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import { useDefaultPartitionOption, useDefaultUserRoleOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../types/pages/common'
import { IUserFormData } from '../../types/pages/user'
import { SERVER_QUERY } from '../../utils/config'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'
import UserForm from '../../components/pages/user/form/UserForm'
import serverErrorHandler from '../../utils/serverErrorHandler'

// Component to create a User
function CreateUser() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
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
  // Set default Partition and Role
  useDefaultPartitionOption<IUserFormData>(setFormData)
  useDefaultUserRoleOption<IUserFormData>(
    setFormData,
    `${SERVER_QUERY.selectorDataQuery}&PartitionNo=${formData?.Partition?.value}`
  )

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(userApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to user list page on success
      navigate(routeProperty.user.path())
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
      link: routeProperty.user.path(),
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
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color='apply' size='large' onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size='large' color='cancel' link={routeProperty.user.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateUser
