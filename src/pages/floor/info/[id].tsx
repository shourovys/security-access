import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { floorApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import FloorInfoForm from '../../../components/pages/floor/form/FloorInfoForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IFloorInfoFormData, IFloorResult } from '../../../types/pages/floor'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import FloorForm from '../../../components/pages/floor/form/FloorForm'

// Component to show details of a floor
function FloorInfo() {
  const navigate = useNavigate()
  // Get the floor ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IFloorInfoFormData>({
    FloorName: '',
    FloorDesc: '',
    Partition: null,
    Node: [],
    Door: [],
    Region: [],
    Input: [],
    Output: [],
    Elevator: [],
    Relay: [],
    Camera: [],
    Nvr: [],
    Channel: [],
    Gateway: [],
    Lockset: [],
    Facegate: [],
    Subnode: [],
    Reader: [],
    ContGate: [],
    ContLock: [],
    Intercom: [],
    Trigger: [],
    Threat: [],
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Floor from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IFloorResult>>(
    isDeleted || !queryId ? null : floorApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        FloorName,
        FloorDesc,
        Partition,
        Items: {
          Node,
          Door,
          Region,
          Input,
          Output,
          Elevator,
          Relay,
          Camera,
          Nvr,
          Channel,
          Gateway,
          Lockset,
          Facegate,
          Subnode,
          Reader,
          ContGate,
          ContLock,
          Intercom,
          Trigger,
          Threat,
        },
      } = data.data
      setFormData({
        FloorName,
        FloorDesc,
        Partition: {
          label: Partition.PartitionName,
          value: Partition.PartitionNo.toString(),
        },
        Node,
        Door,
        Region,
        Input,
        Output,
        Elevator,
        Relay,
        Camera,
        Nvr,
        Channel,
        Gateway,
        Lockset,
        Facegate,
        Subnode,
        Reader,
        ContGate,
        ContLock,
        Intercom,
        Trigger,
        Threat,
      })
    }
  }, [data])

  // Define the mutation function to delete the floor from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    floorApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to floor list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.floor.path(), { replace: true })
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
      link: routeProperty.floorEdit.path(queryId),
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
      link: routeProperty.floor.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <FloorForm formData={formData} isLoading={isLoading} />
        <FloorInfoForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default FloorInfo
