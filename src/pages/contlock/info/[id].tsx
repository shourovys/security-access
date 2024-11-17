import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { contLockApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ContLockForm from '../../../components/pages/contLock/form/ContLockForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse, booleanSelectObject } from '../../../types/pages/common'
import {
  IContLockInfoFormData,
  IContLockResult,
  contLockContactStatObject,
  contLockLockStatObject,
} from '../../../types/pages/contLock'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a contLock
function ContLockInfo() {
  const navigate = useNavigate()
  // Get the contLock ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IContLockInfoFormData>({
    ContLockName: '',
    ContLockDesc: '',
    Partition: null,
    ContGate: null,
    RfAddress: '',
    LockId: '',
    Online: '',
    Busy: '',
    LockStat: '',
    ContactStat: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the ContLock from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IContLockResult>>(
    isDeleted || !queryId ? null : contLockApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        ContLockName,
        ContLockDesc,
        Partition,
        ContGate,
        RfAddress,
        LockId,
        Online,
        Busy,
        LockStat,
        ContactStat,
      } = data.data
      setFormData({
        ContLockName,
        ContLockDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        ContGate: {
          value: ContGate.ContGateNo.toString(),
          label: ContGate.ContGateName,
        },
        RfAddress: RfAddress.toString(),
        LockId,
        Online: booleanSelectObject[Online],
        Busy: booleanSelectObject[Busy],
        LockStat: contLockLockStatObject[LockStat],
        ContactStat: contLockContactStatObject[ContactStat],
      })
    }
  }, [data])

  // Define the mutation function to delete the contLock from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    contLockApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to contLock list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.contLock.path(), { replace: true })
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
      link: routeProperty.contLockEdit.path(queryId),
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
      link: routeProperty.contLock.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ContLockForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default ContLockInfo
