import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { serialApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import SerialForm from '../../../components/pages/serial/form/SerialForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { parityOptions } from '../../../types/pages/format'
import { ISerialFormData, ISerialResult, serialProtocolOptions } from '../../../types/pages/serial'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a serial
function SerialInfo() {
  const navigate = useNavigate()
  // Get the serial ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data
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
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the serial from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ISerialResult>>(
    isDeleted || !queryId ? null : serialApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { name, description, device, band_rate, data_bit, stop_bit, parity, protocol, node } =
        data.data

      // Map the saved parity and protocol to their corresponding options
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

  // Define the mutation function to delete the serial from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    serialApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to serial list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.serial.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )

  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }
    openAlertDialogWithPromise(deleteMutation, { success: t`Success` }, t`Do you want to Delete ?`)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.serialEdit.path(queryId),
    },
    {
      color: 'danger',
      icon: deleteIcon,
      text: t`Delete`,
      onClick: handleDelete,
      isLoading: deleteIsLoading,
    },
    {
      color: 'danger',
      icon: listIcon,
      text: t`List`,
      link: routeProperty.serial.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <SerialForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default SerialInfo
