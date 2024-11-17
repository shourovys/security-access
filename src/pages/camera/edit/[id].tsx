import { sendPutRequest } from '../../../api/swrConfig'
import { cameraApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import { ICameraFormData, ICameraResult } from '../../../types/pages/camera'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import validateCameraFormData from '../../../utils/validation/camera'
import CameraForm from '../../../components/pages/camera/form/CameraForm'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to edit a Camera
function EditCamera() {
  const navigate = useNavigate()
  // Get the camera ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<ICameraFormData>({
    Partition: null,
    Node: null,
    UserId: '',
    CameraPort: '',
    MainUrl: '',
    SubUrl: '',
    Password: '',
    PreTime: '',
    PostTime: '',
    MinTime: '',
    MaxTime: '',
    CameraName: '',
    CameraDesc: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Camera from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ICameraResult>>(
    queryId ? cameraApi.details(queryId) : null
  )
  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        Partition,
        Node,
        UserId,
        CameraPort,
        MainUrl,
        SubUrl,
        Password,
        PreTime,
        PostTime,
        MinTime,
        MaxTime,
        CameraName,
        CameraDesc,
      } = data.data

      setFormData({
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Node: Node
          ? {
              value: Node.NodeNo.toString(),
              label: Node.NodeName,
            }
          : null,
        UserId: UserId,
        CameraPort: CameraPort.toString(),
        MainUrl,
        SubUrl,
        Password,
        PreTime: PreTime.toString(),
        PostTime: PostTime.toString(),
        MinTime: MinTime.toString(),
        MaxTime: MaxTime.toString(),
        CameraName,
        CameraDesc,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(cameraApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.cameraInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateCameraFormData(formData)

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
      link: routeProperty.cameraInfo.path(queryId),
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
          isLoading={isLoading}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.cameraInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditCamera
