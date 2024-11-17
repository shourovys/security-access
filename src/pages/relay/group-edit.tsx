import { sendPutRequest } from '../../api/swrConfig'
import { relayApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import RelayGroupEditForm from '../../components/pages/relay/form/RelayGroupEditForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useSearchParams } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange, THandleInputSelect } from '../../types/components/common'
import {
  IFormErrors,
  INewFormErrors,
  ISelectedInputFields,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../types/pages/common'
import { IRelayGroupEditFormData, IRelayResult, relayTypeOptions } from '../../types/pages/relay'
import { findSelectOption } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { editSuccessfulToast, groupEditSuccessfulToast } from '../../utils/toast'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to edit a Relay
function RelayGroupEdit() {
  const navigate = useNavigate()
  // Get the relay IDs from the router query
  const [searchParams] = useSearchParams()
  const queryIds: string[] = searchParams.get('ids')?.split(',') || ['']

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IRelayGroupEditFormData>({
    Partition: null,
    // Elevator: null,
    RelayType: null,
    OnTime: '',
    OffTime: '',
    Repeat: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // state for track is relay field is select
  const [selectedInputFields, setSelectedInputFields] = useState<
    ISelectedInputFields<IRelayGroupEditFormData>
  >({})

  // Fetch the details of the Relay from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IRelayResult>>(
    queryIds[0] ? relayApi.details(queryIds[0]) : null
  )

  useEffect(() => {
    if (data) {
      const { Partition, RelayType, OnTime, OffTime, Repeat } = data.data

      setFormData({
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        // Elevator: Elevator
        //   ? {
        //       value: Elevator.ElevatorNo.toString(),
        //       label: Elevator.ElevatorName,
        //     }
        //   : null,
        RelayType: findSelectOption(relayTypeOptions, RelayType),
        OnTime: OnTime.toString(),
        OffTime: OffTime.toString(),
        Repeat: Repeat.toString(),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Update the selected input fields when any input selected
  const handleInputSelect: THandleInputSelect = (name, value) => {
    if (name === 'Relay') {
      setSelectedInputFields((state) => ({
        ...state,
        Partition: value,
        // Elevator: value,
        RelayType: value,
        OnTime: value,
        OffTime: value,
        Repeat: value,
      }))
    } else {
      setSelectedInputFields((state) => ({ ...state, [name]: value }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(relayApi.groupEdit, sendPutRequest, {
    onSuccess: () => {
      groupEditSuccessfulToast()
      navigate(routeProperty.relay.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: INewFormErrors<IRelayGroupEditFormData> = {}

    if (selectedInputFields.Partition && !formData.Partition?.value) {
      errors.Partition = t`Partition is required`
    }
    // if (selectedInputFields.Elevator && !formData.Elevator?.value) {
    //   errors.Elevator= t`Elevator is required`
    // }
    if (selectedInputFields.RelayType && !formData.RelayType?.value) {
      errors.RelayType = t`Type is required`
    }
    if (selectedInputFields.OnTime && !formData.OnTime) {
      errors.OnTime = t`On Time is required`
    }
    if (selectedInputFields.OffTime && !formData.OffTime) {
      errors.OffTime = t`Off Time is required`
    }
    if (selectedInputFields.Repeat && !formData.Repeat) {
      errors.Repeat = t`Repeat is required`
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
      RelayNos: queryIds,
      ...(selectedInputFields.Partition && {
        PartitionNo: formData.Partition?.value,
      }),
      // ...(selectedInputFields.Elevator && {
      //   ElevatorNo: formData.Elevator?.value,
      // }),
      ...(selectedInputFields.RelayType && {
        RelayType: Number(formData.RelayType?.value),
      }),
      ...(selectedInputFields.OnTime && {
        OnTime: Number(formData.OnTime),
      }),
      ...(selectedInputFields.OffTime && {
        OffTime: Number(formData.OffTime),
      }),
      ...(selectedInputFields.Repeat && {
        Repeat: Number(formData.Repeat),
      }),
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
      link: routeProperty.relay.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <RelayGroupEditForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          selectedFields={selectedInputFields}
          handleSelect={handleInputSelect}
          isLoading={isLoading}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.relay.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default RelayGroupEdit
