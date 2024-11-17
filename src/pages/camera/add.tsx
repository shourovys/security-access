import { sendPostRequest } from '../../api/swrConfig'
import { cameraApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import { useDefaultNodeOption, useDefaultPartitionOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import { ICameraFormData } from '../../types/pages/camera'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../types/pages/common'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import validateCameraFormData from '../../utils/validation/camera'
import CameraForm from '../../components/pages/camera/form/CameraForm'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to create a new camera
function CreateCamera() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<ICameraFormData>({
    Partition: null,
    Node: null,
    CameraPort: '',
    MainUrl: '',
    SubUrl: '',
    UserId: '',
    Password: '',
    PreTime: '10',
    PostTime: '20',
    MinTime: '10',
    MaxTime: '30',
    CameraName: '',
    CameraDesc: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Set default Partition and Node
  useDefaultPartitionOption<ICameraFormData>(setFormData)
  useDefaultNodeOption<ICameraFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(cameraApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to camera list page on success
      navigate(routeProperty.camera.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateCameraFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      PartitionNo: formData.Partition?.value,
      NodeNo: formData.Node?.value,
      UserId: formData.UserId,
      CameraPort: formData.CameraPort || 0,
      MainUrl: formData.MainUrl || 0,
      SubUrl: formData.SubUrl || 0,
      Password: formData.Password,
      PreTime: formData.PreTime || 0,
      PostTime: formData.PostTime || 0,
      MinTime: formData.MinTime || 0,
      MaxTime: formData.MaxTime || 0,
      CameraName: formData.CameraName,
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
      link: routeProperty.camera.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <CameraForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.schedule.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateCamera
