import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { nvrApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import NvrForm from '../../../components/pages/nvr/form/NvrForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { INvrFormData, INvrResult, nvrTypeOptions } from '../../../types/pages/nvr'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a Network Video Recorder (NVR)
function NvrInfo() {
  const navigate = useNavigate()
  // Get the NVR ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data
  const [formData, setFormData] = useState<INvrFormData>({
    NvrName: '',
    NvrDesc: '',
    NvrType: null,
    IpAddress: '',
    RtspPort: '',
    DataPort: '',
    UserId: '',
    Password: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the NVR from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<INvrResult>>(
    isDeleted || !queryId ? null : nvrApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { NvrName, NvrType, IpAddress, NvrDesc, RtspPort, DataPort, UserId, Password } =
        data.data
      setFormData({
        NvrName,
        NvrType: findSelectOption(nvrTypeOptions, NvrType),
        IpAddress,
        NvrDesc,
        RtspPort: RtspPort.toString(),
        DataPort: DataPort.toString(),
        UserId,
        Password,
      })
    }
  }, [data])

  // Define the mutation function to delete the NVR from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    nvrApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to NVR list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.nvr.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )

  const token = sessionStorage.getItem('accessToken')

  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = async () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }
    //  nvrs/<int:pk>/details/
    const res = await fetch(`${import.meta.env.VITE_API_URL}/devices/nvrs/${queryId}/details/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    // console.log(data, '------');

    const messages = []

    let isNoRelatedEntities = false

    for (const key in data) {
      if (data[key] === '') {
        isNoRelatedEntities = true
        break
      } else if (data[key] !== undefined && data[key] !== 0) {
        messages.push(`${data[key]}`)
      }
    }

    let myMessage
    if (isNoRelatedEntities) {
      myMessage = (
        <div>
          <p>Do you want to Delete?</p>
        </div>
      )
    } else {
      const tableRows = messages.map((message, index) => (
        <tr key={index}>
          <td>{message}</td>
        </tr>
      ))

      myMessage = (
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-lg">If you Delete this, the followings also:</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
            <tfoot>
              <tr>
                <td className="">Do you want to Delete?</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )
    }

    openAlertDialogWithPromise(deleteMutation, { success: t`Success` }, myMessage as any)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.nvrEdit.path(queryId),
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
      link: routeProperty.nvr.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageTitle="NVR"
        pageRoutes={[
          {
            href: routeProperty.nvr.path(),
            text: 'NVR',
          },
          {
            href: routeProperty.nvrInfo.path(queryId),
            text: 'Information',
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <NvrForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default NvrInfo
