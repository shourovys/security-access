import { sendPutRequest } from '../../../api/swrConfig'
import { channelApi } from '../../../api/urls'
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
import { IChannelFormData, IChannelResult } from '../../../types/pages/channel'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectObject,
  booleanSelectOption,
} from '../../../types/pages/common'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import ChannelForm from '../../../components/pages/channel/form/ChannelForm'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to edit a Channel
function EditChannel() {
  const navigate = useNavigate()
  // Get the channel ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IChannelFormData>({
    ChannelName: '',
    ChannelDesc: '',
    Partition: null,
    Nvr: null,
    ChannelId: '',
    Streaming: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Channel from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IChannelResult>>(
    queryId ? channelApi.details(queryId) : null
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

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(channelApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.channelInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.ChannelName) {
      errors.ChannelName = t`Channel Name is required`
    }

    if (!formData.Partition?.value) {
      errors.Partition = t`Partition is required`
    }

    if (!formData.Nvr?.value) {
      errors.Nvr = t`NVR is required`
    }

    if (!formData.ChannelId) {
      errors.ChannelId = t`Channel Id is required`
    }

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
      ChannelName: formData.ChannelName,
      ChannelDesc: formData.ChannelDesc,
      PartitionNo: formData.Partition?.value,
      NvrNo: formData.Nvr?.value,
      ChannelId: formData.ChannelId,
      Streaming: formData.Streaming?.value,
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
      link: routeProperty.channelInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ChannelForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color='apply' size='large' onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size='large' color='cancel' link={routeProperty.channelInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditChannel
