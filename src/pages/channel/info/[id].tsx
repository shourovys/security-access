import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { channelApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import Modal from '../../../components/HOC/modal/Modal'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import StreamModal from '../../../components/common/Stream/StreamModal'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ChannelForm from '../../../components/pages/channel/form/ChannelForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { IChannelFormData, IChannelResult } from '../../../types/pages/channel'
import {
  ISingleServerResponse,
  booleanSelectObject,
  booleanSelectOption,
} from '../../../types/pages/common'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon, streamIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a channel
function ChannelInfo() {
  const navigate = useNavigate()
  // Get the channel ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data
  const [formData, setFormData] = useState<IChannelFormData>({
    ChannelName: '',
    ChannelDesc: '',
    Partition: null,
    Nvr: null,
    ChannelId: '',
    Streaming: null,
    Online: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Define the state for manage stream modal state
  const [streamModal, setStreamModal] = useState<boolean>(false)

  // Fetch the details of the Channel from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IChannelResult>>(
    isDeleted || !queryId ? null : channelApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { ChannelName, ChannelDesc, Partition, Nvr, ChannelId, Streaming, Online } = data.data
      setFormData({
        ChannelName,
        ChannelDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Nvr: {
          value: Nvr.NvrNo.toString(),
          label: Nvr.NvrName,
        },
        ChannelId,
        Streaming: findSelectOption(booleanSelectOption, Streaming),
        Online: booleanSelectObject[Online],
      })
    }
  }, [data])

  // Define the mutation function to delete the channel from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    channelApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to channel list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.channel.path(), { replace: true })
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
      link: routeProperty.channelEdit.path(queryId),
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
      link: routeProperty.channel.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ChannelForm formData={formData} isLoading={isLoading} />
      </FormContainer>
      {/* stream modal */}
      <Modal openModal={streamModal} setOpenModal={setStreamModal}>
        <StreamModal
          type="channel"
          name={formData.ChannelName}
          deviceId={queryId}
          setOpenModal={setStreamModal}
        />
      </Modal>
    </Page>
  )
}

export default ChannelInfo
