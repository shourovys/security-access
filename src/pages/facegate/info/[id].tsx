import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { facegateApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import FacegateForm from '../../../components/pages/facegate/form/FacegateForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import {
  ISingleServerResponse,
  booleanSelectObject,
  booleanSelectOption,
} from '../../../types/pages/common'
import {
  IFacegateInfoFromData,
  IFacegateResult,
  facegateContactStatObject,
  facegateGateTypeOptions,
  facegateLockStatObject,
  facegateOpenDoorWayOptions,
  facegateVerifyModeOptions,
} from '../../../types/pages/facegate'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a facegate
function FacegateInfo() {
  const navigate = useNavigate()
  // Get the facegate ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IFacegateInfoFromData>({
    FacegateName: '',
    FacegateDesc: '',
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

  // Fetch the details of the Facegate from the server if data not deleted
  const { isLoading, data } = useSWR<ISingleServerResponse<IFacegateResult>>(
    isDeleted || !queryId ? null : facegateApi.details(queryId)
  )
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const {
        FacegateName,
        FacegateDesc,
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
        FacegateName,
        FacegateDesc,
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
        OpenDoorWay: findSelectOption(facegateOpenDoorWayOptions, OpenDoorWay),
        GateType: findSelectOption(facegateGateTypeOptions, GateType),
        VerifyMode: findSelectOption(facegateVerifyModeOptions, VerifyMode),
        FaceThreshold: FaceThreshold.toString(),
        SipGateId: SipGateId.toString(),
        SipPassword,
        SipOperatorId: SipOperatorId.toString(),
        SipDtmfLock: SipDtmfLock.toString(),
        SipIncomingCall: findSelectOption(booleanSelectOption, SipIncomingCall),
        Online: booleanSelectObject[Online],
        Busy: booleanSelectObject[Busy],
        LockStat: facegateLockStatObject[LockStat],
        ContactStat: facegateContactStatObject[ContactStat],
      })
    }
  }, [data])

  // Define the mutation function to delete the facegate from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    facegateApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to facegate list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.facegate.path())
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
      link: routeProperty.facegateEdit.path(queryId),
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
      link: routeProperty.facegate.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <FacegateForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default FacegateInfo
