import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPutRequest } from '../../../api/swrConfig'
import { elevatorApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ElevatorForm from '../../../components/pages/elevator/form/ElevatorForm'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import {
  IElevatorFormData,
  IElevatorResult,
  elevatorThreatLevelOptions,
  readerTypeOptions,
} from '../../../types/pages/elevator'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../utils/toast'
import t from '../../../utils/translator'
import validateElevatorFormData from '../../../utils/validation/elevator'

// Component to edit a Elevator
function EditElevator() {
  const navigate = useNavigate()
  // Get the elevator ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IElevatorFormData>({
    ElevatorName: '',
    ElevatorDesc: '',
    NodeNo: '',
    SubnodeNo: '',
    ReaderType: null,
    Reader: null,
    ThreatLevel: null,
    Partition: null,
    Threat: null,
    ElevatorPort: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Elevator from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IElevatorResult>>(
    queryId ? elevatorApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        ElevatorName,
        ElevatorDesc,
        NodeNo,
        SubnodeNo,
        Partition,
        Reader,
        ReaderType,
        Threat,
        ThreatLevel,
        ElevatorPort,
      } = data.data

      setFormData({
        ElevatorName,
        ElevatorDesc,
        SubnodeNo: SubnodeNo.toString(),
        NodeNo: NodeNo.toString(),
        ReaderType: findSelectOption(readerTypeOptions, ReaderType),
        Reader: Reader
          ? {
              value: Reader?.ReaderNo.toString(),
              label: Reader?.ReaderName,
            }
          : null,
        ThreatLevel: findSelectOption(elevatorThreatLevelOptions, ThreatLevel),
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Threat: Threat
          ? {
              label: Threat.ThreatName,
              value: Threat.ThreatNo.toString(),
            }
          : null,
        ElevatorPort: ElevatorPort.toString(),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(elevatorApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.elevatorInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateElevatorFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      ElevatorName: formData.ElevatorName,
      ElevatorDesc: formData.ElevatorDesc,
      ReaderType: formData.ReaderType?.value,
      ThreatLevel: formData.ThreatLevel?.value,
      PartitionNo: formData.Partition?.value,
      ThreatNo: formData.Threat?.value,
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
      link: routeProperty.elevatorInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ElevatorForm
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
        <Button size="large" color="cancel" link={routeProperty.elevatorInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditElevator
