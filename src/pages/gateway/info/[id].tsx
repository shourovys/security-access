import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { gatewayApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import CardModal from '../../../components/HOC/modal/CardModal'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import GatewayFwUpdateListModal from '../../../components/pages/gateway/GatewayFwUpdateListModal'
import GatewayForm from '../../../components/pages/gateway/form/GatewayForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectObject } from '../../../types/pages/common'
import { IGatewayFormData, IGatewayResult } from '../../../types/pages/gateway'
import { deleteIcon, editIcon, fwUpdateIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a gateway
function GatewayInfo() {
  const navigate = useNavigate()
  // Get the gateway ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()
  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IGatewayFormData>({
    Node: null,
    UserId: '',
    IpAddress: '',
    ApiPort: '',
    GatewayName: '',
    GatewayDesc: '',
    Password: '',
    Online: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Define state variables for modals view
  const [openFwList, setOpenFwList] = useState(false)

  // Fetch the details of the Gateway from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IGatewayResult>>(
    isDeleted || !queryId ? null : gatewayApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { GatewayName, GatewayDesc, Node, IpAddress, ApiPort, UserId, Password, Online } =
        data.data
      setFormData({
        GatewayName,
        GatewayDesc,
        Node: {
          value: Node.NodeNo.toString(),
          label: Node.NodeName,
        },
        IpAddress,
        ApiPort: ApiPort.toString(),
        UserId,
        Password,
        Online: booleanSelectObject[Online],
      })
    }
  }, [data])

  // Define the mutation function to delete the gateway from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    gatewayApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to gateway list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.gateway.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )
  // // Define the function to call delete mutation with Alert Dialog
  // const handleDelete = () => {
  //   const deleteMutation = () => {
  //     setIsDeleted(true)
  //     return deleteTrigger()
  //   }
  //   openAlertDialogWithPromise(deleteMutation, { success: t`Success` })
  // }

  const token = sessionStorage.getItem('accessToken')

  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = async () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }
    //  gateways/<int:pk>/details/
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/devices/gateways/${queryId}/details/`,
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
                <th className="text-lg">If you delete this, the followings also:</th>
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
      icon: fwUpdateIcon,
      text: t`FW Update`,
      onClick: () => setOpenFwList(true),
      disabled: !formData.IpAddress || !formData.ApiPort,
    },
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.gatewayEdit.path(queryId),
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
      link: routeProperty.gateway.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <GatewayForm formData={formData} isLoading={isLoading} />
      </FormContainer>
      {/* FW Update list modal  */}
      <CardModal
        icon={fwUpdateIcon}
        headerTitle={t`Gateway FW Update`}
        openModal={openFwList}
        setOpenModal={setOpenFwList}
      >
        <GatewayFwUpdateListModal parentFormData={formData} setOpenModal={setOpenFwList} />
      </CardModal>
    </Page>
  )
}

export default GatewayInfo
