import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { systemApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import SystemEditFieldFrom from '../../components/pages/system/edit/SystemEditFieldFrom'
import SystemEditSoftwareForm from '../../components/pages/system/edit/SystemEditSoftwareForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectOption,
} from '../../types/pages/common'
import {
  ISystemEditFormData,
  ISystemResult,
  systemBoardCountOptions,
  systemMediaOptions,
} from '../../types/pages/system'
import { findSelectOptionOrDefault } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to edit System
function EditSystem() {
  const navigate = useNavigate()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<ISystemEditFormData>({
    No: '',
    Name: '',
    BackupMedia: null,
    RecordMedia: null,
    BoardCount: null,
    AutoUpdate: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the System from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ISystemResult>>(systemApi.details)
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { No, Name, BackupMedia, RecordMedia, BoardCount, AutoUpdate } = data.data

      setFormData({
        No: No.toString(),
        Name,
        BackupMedia: findSelectOptionOrDefault(systemMediaOptions, BackupMedia),
        RecordMedia: findSelectOptionOrDefault(systemMediaOptions, RecordMedia),
        BoardCount: findSelectOptionOrDefault(systemBoardCountOptions, BoardCount),
        AutoUpdate: findSelectOptionOrDefault(booleanSelectOption, AutoUpdate || 0),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(systemApi.edit, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.systemInfo.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.Name) {
      errors.Name = t`System Name is required`
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
      No: formData.No,
      Name: formData.Name,
      BackupMedia: formData.BackupMedia?.value,
      RecordMedia: formData.RecordMedia?.value,
      BoardCount: formData.BoardCount?.value,
      AutoUpdate: formData.AutoUpdate?.value,
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
      link: routeProperty.systemInfo.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        // breadcrumbs navbar & router link
        pageRoutes={[
          {
            href: routeProperty.systemInfo.path(),
            text: t`System`,
          },
          {
            href: routeProperty.systemEdit.path(),
            text: t`Edit`,
          },
        ]}
        // ---end --rubel
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false} sameHeight>
        <SystemEditFieldFrom
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        <SystemEditSoftwareForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        {/* <SystemEditIOBoardFrom
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        /> */}
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.systemInfo.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditSystem
