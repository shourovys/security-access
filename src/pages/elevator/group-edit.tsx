import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { elevatorApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import ElevatorGroupEditForm from '../../components/pages/elevator/form/ElevatorGroupEditForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import routeProperty from '../../routes/routeProperty'
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
import {
  IElevatorGroupEditFormData,
  IElevatorResult,
  elevatorThreatLevelOptions,
  readerTypeOptions,
} from '../../types/pages/elevator'
import { findSelectOption } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { groupEditSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to edit a Elevator
function ElevatorGroupEdit() {
  const navigate = useNavigate()
  // Get the elevator IDs from the router query
  const [searchParams] = useSearchParams()
  const queryIds: string[] = searchParams.get('ids')?.split(',') || ['']

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IElevatorGroupEditFormData>({
    ReaderType: null,
    ThreatLevel: null,
    Partition: null,
    Threat: null,
  })

  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // state for tracking if the elevator field is selected
  const [selectedInputFields, setSelectedInputFields] = useState<
    ISelectedInputFields<IElevatorGroupEditFormData>
  >({})

  // Fetch the details of the Elevator from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IElevatorResult>>(
    queryIds[0] ? elevatorApi.details(queryIds[0]) : null
  )

  useEffect(() => {
    if (data) {
      const { Partition, ReaderType, Threat, ThreatLevel } = data.data

      setFormData({
        ReaderType: findSelectOption(readerTypeOptions, ReaderType),
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
    if (name === 'Elevator') {
      setSelectedInputFields((state) => ({
        ...state,
        ReaderType: value,
        ThreatLevel: value,
        Partition: value,
        ThreatNo: value,
      }))
    } else {
      setSelectedInputFields((state) => ({ ...state, [name]: value }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(elevatorApi.groupEdit, sendPostRequest, {
    onSuccess: () => {
      groupEditSuccessfulToast()
      navigate(routeProperty.elevator.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: INewFormErrors<IElevatorGroupEditFormData> = {}

    if (selectedInputFields.Partition && !formData.Partition?.value) {
      errors.Partition = t`Partition is required`
    }

    if (selectedInputFields.ReaderType && !formData.ReaderType?.value) {
      errors.ReaderType = t`Reader Type is required`
    }

    if (selectedInputFields.ThreatLevel && !formData.ThreatLevel?.value) {
      errors.ThreatLevel = t`Threat Level is required`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      ElevatorNos: queryIds,
      ...(selectedInputFields.Partition && {
        PartitionNo: Number(formData.Partition?.value),
      }),
      ...(selectedInputFields.ReaderType && {
        ReaderType: Number(formData.ReaderType?.value),
      }),
      ...(selectedInputFields.ThreatLevel && {
        ThreatLevel: Number(formData.ThreatLevel?.value),
      }),
      ...(selectedInputFields.Threat && {
        ThreatNo: Number(formData.Threat?.value),
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
      link: routeProperty.elevator.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ElevatorGroupEditForm
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
        <Button size="large" color="cancel" link={routeProperty.elevator.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default ElevatorGroupEdit
