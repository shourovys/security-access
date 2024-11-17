import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPutRequest } from '../../api/swrConfig'
import { authApi } from '../../api/urls'
import useAuth from '../../hooks/useAuth'
import useUserPermittedPages from '../../hooks/usePermittedPages'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../types/pages/common'
import {
  IProfileFormData,
  IProfileResult,
  LanguageOptions,
  dateFormatOptions,
  timeFormatOptions,
} from '../../types/pages/profile'
import { findSelectOption } from '../../utils/findSelectOption'
import Icon, { applyIcon, cancelIcon } from '../../utils/icons'
import isValidEmail from '../../utils/isValidEmail'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'
import FormActionButtonsContainer from '../HOC/style/form/FormActionButtonsContainer'
import FormContainer from '../HOC/style/form/FormContainer'
import Button from '../atomic/Button'
import { ISelectOption } from '../atomic/Selector'
import ProfileForm from '../pages/profile/form/ProfileForm'

interface IProps {
  setOpenModal: (openModal: boolean) => void
}

// Component to edit a Profile
function ProfileModal({ setOpenModal }: IProps) {
  // Prompt the user before unloading the page if there are unsaved changes
  // useBeforeunload(() => t('You will lose your changes!'))

  const { refresh: authRefresh } = useAuth()

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IProfileFormData>({
    UserId: '',
    OldPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
    Email: '',
    UserDesc: '',
    Launch: null,
    Language: null,
    DateFormat: null,
    TimeFormat: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Inside ProfileModal component
  const userPermittedPagesData = useUserPermittedPages()
  const userPermittedPagesOptions: ISelectOption[] = userPermittedPagesData.map((item) => ({
    value: item.PageNo?.toString(),
    label: t(item.PageName),
  }))

  // Fetch the details of the Profile from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IProfileResult>>(authApi.profile)
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { UserId, UserDesc, Email, Launch, Language, DateFormat, TimeFormat } = data.data.user
      setFormData({
        ...formData,
        UserId,
        Email,
        UserDesc: UserDesc ?? '',
        Launch: findSelectOption(userPermittedPagesOptions, Launch),
        Language: findSelectOption(LanguageOptions, Language),
        DateFormat: findSelectOption(dateFormatOptions, DateFormat),
        TimeFormat: findSelectOption(timeFormatOptions, TimeFormat),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  const handleModalClose = () => setOpenModal(false)

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(authApi.profile, sendPutRequest, {
    onSuccess: () => {
      handleModalClose()
      editSuccessfulToast(`Profile has been updated successfully.`)
      authRefresh()
      window.location.reload()
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.UserId) {
      errors.UserId = t`User ID is required`
    }
    if (formData.Email && !isValidEmail(formData.Email)) {
      errors.Email = t`Please enter a valid email address`
    }

    // Conditionally validate "New Password" only if it's being updated
    // if (formData.NewPassword) {
    //   if (!formData.OldPassword) {
    //     errors.OldPassword = t`Old Password is required`
    //   }
    //   if (formData.NewPassword !== formData.ConfirmPassword) {
    //     errors.ConfirmPassword = t`Passwords do not match`
    //   }
    // }

    if (formData.NewPassword) {
      if (!formData.OldPassword) {
        errors.OldPassword = t`Old Password is required`
      }
      if (formData.NewPassword !== formData.ConfirmPassword) {
        errors.ConfirmPassword = t`Passwords do not match`
      }
    }
    // If ConfirmPassword is provided without NewPassword, show an error
    if (formData.ConfirmPassword && !formData.NewPassword) {
      errors.NewPassword = t`New Password is required`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      UserId: formData.UserId,
      OldPassword: formData.OldPassword ? formData.OldPassword : null,
      NewPassword: formData.NewPassword ? formData.NewPassword : null,
      Email: formData.Email,
      UserDesc: formData.UserDesc,
      Launch: formData.Launch?.value,
      Language: formData.Language?.value,
      DateFormat: formData.DateFormat?.value,
      TimeFormat: formData.TimeFormat?.value,
    }
    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  // const breadcrumbsActionsButtons: IActionsButton[] = [
  //   {
  //     color: 'apply',
  //     icon: applyIcon,
  //     text: t`Apply`,
  //     onClick: handleSubmit,
  //     isLoading: isMutating,
  //   },
  // ]

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      {/* Render the breadcrumbs bar with the defined actions */}
      {/* <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        pageRoutes={[
          {
            href: routeProperty.profile.path(),
            text: t`Profile`,
          },
        ]}
      />
      <div className="pt-2" /> */}
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ProfileForm
          formData={formData}
          userPermittedPagesOptions={userPermittedPagesOptions}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
        />
      </FormContainer>
      <FormActionButtonsContainer allowsShow>
        <Button color="apply" size="base" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="base" color="cancel" onClick={handleModalClose}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer>
    </div>
  )
}

export default ProfileModal
