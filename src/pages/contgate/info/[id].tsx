import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { contGateApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ContGateForm from '../../../components/pages/contGate/form/ContGateForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectObject } from '../../../types/pages/common'
import { IContGateInfoFormData, IContGateResult } from '../../../types/pages/contGate'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a contGate
function ContGateInfo() {
  const navigate = useNavigate()
  // Get the contGate ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IContGateInfoFormData>({
    ContGateName: '',
    ContGateDesc: '',
    Node: null,
    MacAddress: '',
    IpAddress: '',
    ApiPort: '',
    SecurityCode: '',
    RfChannel: '',
    SyncCode: '',
    Online: '',
    Busy: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the ContGate from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IContGateResult>>(
    isDeleted || !queryId ? null : contGateApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        ContGateName,
        ContGateDesc,
        Node,
        MacAddress,
        IpAddress,
        ApiPort,
        SecurityCode,
        RfChannel,
        SyncCode,
        Online,
        Busy,
      } = data.data
      setFormData({
        ContGateName,
        ContGateDesc,
        Node: {
          value: Node.NodeNo.toString(),
          label: Node.NodeName,
        },
        MacAddress,
        IpAddress,
        ApiPort: ApiPort.toString(),
        SecurityCode,
        RfChannel: RfChannel.toString(),
        SyncCode,
        Online: booleanSelectObject[Online],
        Busy: booleanSelectObject[Busy],
      })
    }
  }, [data])

  // Define the mutation function to delete the contGate from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    contGateApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to contGate list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.contGate.path(), { replace: true })
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

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/devices/contgates/${queryId}/details/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
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
      link: routeProperty.contGateEdit.path(queryId),
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
      link: routeProperty.contGate.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ContGateForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default ContGateInfo
