// @ts-nocheck
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { cameraApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import Modal from '../../../components/HOC/modal/Modal'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import StreamModal from '../../../components/common/Stream/StreamModal'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import CameraForm from '../../../components/pages/camera/form/CameraForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ICameraInfoFormData, ICameraResult, recordStatOptions } from '../../../types/pages/camera'
import { ISingleServerResponse, booleanSelectOption } from '../../../types/pages/common'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon, streamIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a camera
function CameraInfo() {
  const navigate = useNavigate()
  // Get the camera ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<ICameraInfoFormData>({
    Partition: null,
    Node: null,
    UserId: '',
    CameraPort: '',
    MainUrl: '',
    SubUrl: '',
    Password: '',
    PreTime: '',
    PostTime: '',
    MinTime: '',
    MaxTime: '',
    CameraName: '',
    CameraDesc: '',
    Online: null,
    RecordStat: null,
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Define the state for manage stream modal state
  const [streamModal, setStreamModal] = useState<boolean>(false)

  // Fetch the details of the camera from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ICameraResult>>(
    isDeleted || !queryId ? null : cameraApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        Partition,
        Node,
        UserId,
        CameraPort,
        MainUrl,
        SubUrl,
        Password,
        PreTime,
        PostTime,
        MinTime,
        MaxTime,
        CameraName,
        CameraDesc,
        Online,
        RecordStat,
      } = data.data

      setFormData({
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Node: Node
          ? {
            value: Node.NodeNo.toString(),
            label: Node.NodeName,
          }
          : null,
        UserId,
        CameraPort: CameraPort.toString(),
        MainUrl,
        SubUrl,
        Password,
        PreTime: PreTime.toString(),
        PostTime: PostTime.toString(),
        MinTime: MinTime.toString(),
        MaxTime: MaxTime.toString(),
        CameraName,
        CameraDesc,
        Online: findSelectOption(booleanSelectOption, Online),
        RecordStat: findSelectOption(recordStatOptions, RecordStat),
      })
    }
  }, [data])

  // Define the mutation function to delete the camera from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    cameraApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to camera list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.camera.path(), { replace: true })
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
      icon: streamIcon,
      text: t`Stream`,
      onClick: () => setStreamModal(true),
    },
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.cameraEdit.path(queryId),
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
      link: routeProperty.camera.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <CameraForm formData={formData} isLoading={isLoading} />
      </FormContainer>
      {/* stream modal */}
      <Modal openModal={streamModal} setOpenModal={setStreamModal}>
        <StreamModal
          type="camera"
          name={formData.CameraName}
          deviceId={queryId}
          setOpenModal={setStreamModal}
        />
      </Modal>
    </Page>
  )
}

export default CameraInfo
