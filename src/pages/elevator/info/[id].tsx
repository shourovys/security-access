import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import { elevatorApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ElevatorForm from '../../../components/pages/elevator/form/ElevatorForm'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import {
  IElevatorInfoFormData,
  IElevatorResult,
  elevatorStatTypesObject,
  elevatorThreatLevelOptions,
  readerTypeOptions,
} from '../../../types/pages/elevator'
import { findSelectOption } from '../../../utils/findSelectOption'
import { editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a elevator
function ElevatorInfo() {
  // const navigate = useNavigate()
  // Get the elevator ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  // const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IElevatorInfoFormData>({
    ElevatorName: '',
    ElevatorDesc: '',
    NodeNo: '',
    SubnodeNo: '',
    NodeName: '',
    SubnodeName: '',
    ReaderType: null,
    Reader: null,
    ThreatLevel: null,
    Partition: null,
    Threat: null,
    ElevatorPort: '',
    ElevatorStat: '',
  })

  const [isDeleted] = useState(false)

  // Fetch the details of the Elevator from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IElevatorResult>>(
    isDeleted || !queryId ? null : elevatorApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        ElevatorName,
        ElevatorDesc,
        Partition,
        NodeNo,
        Node,
        SubnodeNo,
        Subnode,
        ReaderType,
        Reader,
        Threat,
        ThreatLevel,
        ElevatorPort,
        ElevatorStat,
      } = data.data

      setFormData({
        ElevatorName,
        ElevatorDesc,
        SubnodeNo: SubnodeNo.toString(),
        SubnodeName: Subnode?.SubnodeName || '',
        NodeNo: NodeNo.toString(),
        NodeName: Node?.NodeName || '',
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
        ElevatorStat: elevatorStatTypesObject[ElevatorStat],
      })
    }
  }, [data])

  // Define the mutation function to delete the elevator from the server
  // const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
  //   elevatorApi.delete(queryId),
  //   sendDeleteRequest,
  //   {
  //     // Show a success message and redirect to elevator list page on successful delete
  //     onSuccess: () => {
  //       navigate(routeProperty.elevator.path(), { replace: true })
  //     },
  //     // If error occurred - make delete false
  //     onError: () => {
  //       setIsDeleted(false)
  //     },
  //   }
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
      link: routeProperty.elevatorEdit.path(queryId),
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
      link: routeProperty.elevator.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ElevatorForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default ElevatorInfo
