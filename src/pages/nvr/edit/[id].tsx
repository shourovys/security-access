import { sendPutRequest } from '../../../api/swrConfig'
import { nvrApi } from '../../../api/urls'
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
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import { INvrFormData, INvrResult, nvrTypeOptions } from '../../../types/pages/nvr'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import t from '../../../utils/translator'
import validateNvrFormData from '../../../utils/validation/nvr'
import NvrForm from '../../../components/pages/nvr/form/NvrForm'
import serverErrorHandler from '../../../utils/serverErrorHandler'

// Component to edit an NVR
function EditNvr() {
  const navigate = useNavigate()
  // Get the NVR ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<INvrFormData>({
    NvrName: '',
    NvrDesc: '',
    NvrType: null,
    IpAddress: '',
    RtspPort: '',
    DataPort: '',
    UserId: '',
    Password: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the NVR from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<INvrResult>>(
    queryId ? nvrApi.details(queryId) : null
  )
  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { NvrName, NvrType, IpAddress, NvrDesc, RtspPort, DataPort, UserId, Password } =
        data.data
      setFormData({
        NvrName,
        NvrType: findSelectOption(nvrTypeOptions, NvrType),
        IpAddress,
        NvrDesc,
        RtspPort: RtspPort.toString(),
        DataPort: DataPort.toString(),
        UserId,
        Password,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(nvrApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.nvrInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateNvrFormData(formData)

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
      NvrName: formData.NvrName,
      NvrDesc: formData.NvrDesc,
      NvrType: formData.NvrType?.value,
      IpAddress: formData.IpAddress,
      RtspPort: formData.RtspPort,
      DataPort: formData.DataPort,
      UserId: formData.UserId,
      Password: formData.Password,
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
      link: routeProperty.nvrInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <NvrForm
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
        <Button size="large" color="cancel" link={routeProperty.nvrInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditNvr
