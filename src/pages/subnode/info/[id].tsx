import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { subnodeApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import SubnodeForm from '../../../components/pages/subnode/form/SubnodeForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectObject } from '../../../types/pages/common'
import {
  ISubnodeFormData,
  ISubnodeResult,
  subnodeDeviceTypeOptions,
} from '../../../types/pages/subnode'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a subnode
function SubnodeInfo() {
  const navigate = useNavigate()
  // Get the subnode ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and whether data is deleted
  const [formData, setFormData] = useState<ISubnodeFormData>({
    SubnodeName: '',
    SubnodeDesc: '',
    Node: null,
    Address: '',
    Device: '',
    Baudrate: '',
    DeviceType: null,
    PortCount: '',
    Online: '',
  })

  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Subnode from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ISubnodeResult>>(
    isDeleted || !queryId ? null : subnodeApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        SubnodeName,
        SubnodeDesc,
        Node,
        Address,
        Device,
        Baudrate,
        DeviceType,
        PortCount,
        Online,
      } = data.data
      setFormData({
        SubnodeName,
        SubnodeDesc,
        Node: {
          value: Node.NodeNo.toString(),
          label: Node.NodeName,
        },
        Address: Address.toString(),
        Device,
        Baudrate: Baudrate.toString(),
        DeviceType: findSelectOption(subnodeDeviceTypeOptions, DeviceType),
        PortCount: PortCount.toString(),
        Online: booleanSelectObject[Online],
      })
    }
  }, [data])

  // Define the mutation function to delete the subnode from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    subnodeApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to subnode list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.subnode.path(), { replace: true })
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
      link: routeProperty.subnodeEdit.path(queryId),
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
      link: routeProperty.subnode.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <SubnodeForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default SubnodeInfo
