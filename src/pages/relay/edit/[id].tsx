import { sendPutRequest } from '../../../api/swrConfig'
import { relayApi } from '../../../api/urls'
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
import { IRelayFormData, IRelayResult, relayTypeOptions } from '../../../types/pages/relay'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../utils/toast'
import validateRelayFormData from '../../../utils/validation/relay'
import RelayForm from '../../../components/pages/relay/form/RelayForm'
import t from '../../../utils/translator'

// Component to edit a Relay
function EditRelay() {
  const navigate = useNavigate()
  // Get the relay ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IRelayFormData>({
    // Node: null,
    Partition: null,
    RelayName: '',
    RelayDesc: '',
    NodeNo: '',
    // RelayPort: '',
    Elevator: null,
    RelayType: null,
    OnTime: '',
    OffTime: '',
    Repeat: '',
    // RelayStat: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Relay from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IRelayResult>>(
    queryId ? relayApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      const {
        RelayName,
        RelayDesc,
        Partition,
        NodeNo,
        Elevator,
        RelayType,
        OnTime,
        OffTime,
        Repeat,
      } = data.data

      setFormData({
        RelayName,
        RelayDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        // Node: Node
        //   ? {
        //       value: Node.NodeNo.toString(),
        //       label: Node.NodeName,
        //     }
        //   : null,
        NodeNo: NodeNo.toString(),
        Elevator: Elevator
          ? {
              value: Elevator.ElevatorNo.toString(),
              label: Elevator.ElevatorName,
            }
          : null,
        // RelayPort: RelayPort.toString(),
        RelayType: findSelectOption(relayTypeOptions, RelayType),
        OnTime: OnTime.toString(),
        OffTime: OffTime.toString(),
        Repeat: Repeat.toString(),
        // RelayStat: findSelectOption(relayStatOptions, RelayStat),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(relayApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.relayInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateRelayFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value);
      //   }
      // });
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      RelayName: formData.RelayName,
      RelayDesc: formData.RelayDesc,
      // NodeNo: formData.Node?.value,
      PartitionNo: formData.Partition?.value,
      // RelayPort: formData.RelayPort,
      ElevatorNo: formData.Elevator?.value,
      RelayType: formData.RelayType?.value,
      OnTime: formData.OnTime,
      OffTime: formData.OffTime,
      Repeat: formData.Repeat,
      // RelayStat: formData.RelayStat,
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
      link: routeProperty.relayInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <RelayForm
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
        <Button size="large" color="cancel" link={routeProperty.relayInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditRelay
