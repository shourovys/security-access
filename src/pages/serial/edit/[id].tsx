import { sendPutRequest } from '../../../api/swrConfig'
import { serialApi } from '../../../api/urls'
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
import { parityOptions } from '../../../types/pages/format'
import { ISerialFormData, ISerialResult, serialProtocolOptions } from '../../../types/pages/serial'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../utils/toast'
import validateSerialFormData from '../../../utils/validation/serial'
import SerialForm from '../../../components/pages/serial/form/SerialForm'
import t from '../../../utils/translator'

// Component to edit a Schedule
function EditSerial() {
  const navigate = useNavigate()
  // Get the serial ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<ISerialFormData>({
    node: null,
    name: '',
    device: '',
    description: '',
    band_rate: '',
    data_bit: '',
    stop_bit: '',
    parity: null,
    protocol: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Schedule from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ISerialResult>>(
    queryId ? serialApi.details(queryId) : null
  )

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { name, description, device, band_rate, data_bit, stop_bit, parity, protocol, node } =
        data.data

      const savedParity = parityOptions.find((option) => option.value === parity) || null
      const savedProtocol =
        serialProtocolOptions.find((option) => option.value === protocol) || null
      setFormData({
        node: {
          value: node.id.toString(),
          label: node.name,
        },
        name,
        description,
        device,
        band_rate: band_rate.toString(),
        data_bit: data_bit.toString(),
        stop_bit: stop_bit.toString(),
        parity: savedParity,
        protocol: savedProtocol,
      })
    }
  }, [data])

  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(serialApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.serialInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateSerialFormData(formData)

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
      node_id: formData.node?.value,
      name: formData.name,
      device: formData.device,
      description: formData.description,
      band_rate: formData.band_rate,
      data_bit: formData.data_bit,
      stop_bit: formData.stop_bit,
      parity: formData.parity?.value,
      protocol: formData.protocol?.value,
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
      link: routeProperty.serialInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <SerialForm
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
        <Button size="large" color="cancel" link={routeProperty.serialInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditSerial
