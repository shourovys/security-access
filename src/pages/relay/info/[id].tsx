import { relayApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import useAlert from '../../../hooks/useAlert'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import {
  IRelayInfoFormData,
  IRelayResult,
  relayStatOptions,
  relayTypeOptions,
} from '../../../types/pages/relay'
import { findSelectOption } from '../../../utils/findSelectOption'
import { editIcon, listIcon } from '../../../utils/icons'
import RelayForm from '../../../components/pages/relay/form/RelayForm'
import t from '../../../utils/translator'

// Component to show details of a relay
function RelayInfo() {
  const navigate = useNavigate()
  // Get the relay ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and whether the data is deleted
  const [formData, setFormData] = useState<IRelayInfoFormData>({
    // Node: null,
    Partition: null,
    RelayName: '',
    RelayDesc: '',
    // RelayPort: '',
    NodeNo: '',
    NodeName: '',
    SubnodeName: '',
    Elevator: null,
    RelayType: null,
    OnTime: '',
    OffTime: '',
    Repeat: '',
    RelayStat: null,
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Relay from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IRelayResult>>(
    isDeleted || !queryId ? null : relayApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      const {
        RelayName,
        RelayDesc,
        Partition,
        Node,
        NodeNo,
        Subnode,
        Elevator,
        RelayType,
        OnTime,
        OffTime,
        Repeat,
        RelayStat,
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
        SubnodeName: Subnode?.SubnodeName || '',
        NodeNo: NodeNo.toString(),
        NodeName: Node?.NodeName || '',
        Elevator: Elevator
          ? {
              value: Elevator.ElevatorNo.toString(),
              label: Elevator.ElevatorName,
            }
          : null,
        // RelayPort:  RelayPort.toString(),
        RelayType: findSelectOption(relayTypeOptions, RelayType),
        OnTime: OnTime.toString(),
        OffTime: OffTime.toString(),
        Repeat: Repeat.toString(),
        RelayStat: findSelectOption(relayStatOptions, RelayStat),
      })
    }
  }, [data])

  // Define the mutation function to delete the relay from the server
  // const { trigger: deleteTrigger } = useSWRMutation(
  //   relayApi.delete(queryId),
  //   sendDeleteRequest,
  //   {
  //     // Show a success message and redirect to relay list page on successful delete
  //     onSuccess: () => {
  //       navigate(routeProperty.relay.path(), { replace: true })
  //     },
  //     // If error occurred - make delete false
  //     onError: () => {
  //       setIsDeleted(false)
  //     },
  //   },
  // )
  // Define the function to call delete mutation with Alert Dialog
  // const handleDelete = () => {
  //   const deleteMutation = () => {
  //     setIsDeleted(true)
  //     return deleteTrigger()
  //   }
  //   openAlertDialogWithPromise(deleteMutation, { success: t`Successful` })
  // }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.relayEdit.path(queryId),
    },
    // {
    //   color: 'danger',
    //   icon: deleteIcon,
    //   text: t('Delete',
    //   onClick: handleDelete,
    //   isLoading: deleteIsLoading,
    // },
    {
      color: 'danger',
      icon: listIcon,
      text: t`List`,
      link: routeProperty.relay.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <RelayForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default RelayInfo
