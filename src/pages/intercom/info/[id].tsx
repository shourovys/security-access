import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { intercomApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import IntercomForm from '../../../components/pages/intercom/form/IntercomForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import {
  ISingleServerResponse,
  booleanSelectObject,
  booleanSelectOption,
} from '../../../types/pages/common'
import {
  IIntercomInfoFromData,
  IIntercomResult,
  intercomContactStatObject,
  intercomGateTypeOptions,
  intercomLockStatObject,
  intercomOpenDoorWayOptions,
  intercomVerifyModeOptions,
} from '../../../types/pages/intercom'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a intercom
function IntercomInfo() {
  const navigate = useNavigate()
  // Get the intercom ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IIntercomInfoFromData>({
    IntercomName: '',
    IntercomDesc: '',
    Partition: null,
    Node: null,
    IpAddress: '',
    ApiPort: '',
    UserId: '',
    Password: '',
    DeviceId: '',
    OpenDoorWay: null,
    GateType: null,
    VerifyMode: null,
    FaceThreshold: '',
    SipGateId: '',
    SipPassword: '',
    SipOperatorId: '',
    SipDtmfLock: '',
    SipIncomingCall: null,
    Online: '',
    Busy: '',
    LockStat: '',
    ContactStat: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Intercom from the server if data not deleted
  const { isLoading, data } = useSWR<ISingleServerResponse<IIntercomResult>>(
    isDeleted || !queryId ? null : intercomApi.details(queryId)
  )
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        IntercomName,
        IntercomDesc,
        Partition,
        Node,
        IpAddress,
        ApiPort,
        UserId,
        Password,
        DeviceId,
        OpenDoorWay,
        GateType,
        VerifyMode,
        FaceThreshold,
        SipGateId,
        SipPassword,
        SipOperatorId,
        SipDtmfLock,
        SipIncomingCall,
        Online,
        Busy,
        LockStat,
        ContactStat,
      } = data.data

      setFormData({
        IntercomName,
        IntercomDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Node: {
          value: Node.NodeNo.toString(),
          label: Node.NodeName,
        },
        IpAddress,
        ApiPort: ApiPort.toString(),
        UserId,
        Password,
        DeviceId,
        OpenDoorWay: findSelectOption(intercomOpenDoorWayOptions, OpenDoorWay),
        GateType: findSelectOption(intercomGateTypeOptions, GateType),
        VerifyMode: findSelectOption(intercomVerifyModeOptions, VerifyMode),
        FaceThreshold: FaceThreshold.toString(),
        SipGateId: SipGateId.toString(),
        SipPassword,
        SipOperatorId: SipOperatorId.toString(),
        SipDtmfLock: SipDtmfLock.toString(),
        SipIncomingCall: findSelectOption(booleanSelectOption, SipIncomingCall),
        Online: booleanSelectObject[Online],
        Busy: booleanSelectObject[Busy],
        LockStat: intercomLockStatObject[LockStat],
        ContactStat: intercomContactStatObject[ContactStat],
      })
    }
  }, [data])

  // Define the mutation function to delete the intercom from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    intercomApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to intercom list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.intercom.path())
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
      link: routeProperty.intercomEdit.path(queryId),
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
      link: routeProperty.intercom.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <IntercomForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default IntercomInfo
