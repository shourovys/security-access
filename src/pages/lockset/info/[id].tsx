import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { locksetApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import CardModal from '../../../components/HOC/modal/CardModal'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import LocksetFwUpdateListModal from '../../../components/pages/lockset/LocksetFwUpdateListModal'
import LocksetInfoForm from '../../../components/pages/lockset/form/LocksetInfoForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import {
  ISingleServerResponse,
  activeSelectObject,
  booleanSelectObject,
  lockSelectObject,
} from '../../../types/pages/common'
import { ILocksetInfoFormData, ILocksetResult } from '../../../types/pages/lockset'
import { deleteIcon, editIcon, fwUpdateIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a lockset
function LocksetInfo() {
  const navigate = useNavigate()
  // Get the lockset ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<ILocksetInfoFormData>({
    Name: '',
    LocksetName: '',
    LocksetDesc: '',
    LinkId: '',
    Model: '',
    DeviceId: '',
    Partition: null,
    Gateway: null,

    Busy: '',
    Online: '',
    LockStat: '',
    ContactStat: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Define state variables for modals view
  const [openFwList, setOpenFwList] = useState(false)

  // Fetch the details of the Lockset from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ILocksetResult>>(
    isDeleted || !queryId ? null : locksetApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      const {
        Name,
        LocksetName,
        LocksetDesc,
        LinkId,
        Model,
        DeviceId,
        LockStat,
        ContactStat,
        Partition,
        Gateway,
        Online,
        Busy,
      } = data.data
      setFormData({
        Name,
        LocksetName,
        LocksetDesc,
        LinkId,
        Model,
        DeviceId,
        LockStat: lockSelectObject[LockStat],
        ContactStat: activeSelectObject[ContactStat],
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Gateway: Gateway
          ? {
            value: Gateway.GatewayNo.toString(),
            label: Gateway.GatewayName,
          }
          : null,
        Online: booleanSelectObject[Online],
        Busy: booleanSelectObject[Busy],
      })
    }
  }, [data])

  // Define the mutation function to delete the lockset from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    locksetApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to lockset list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.lockset.path(), { replace: true })
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
      icon: fwUpdateIcon,
      text: t`FW Update`,
      onClick: () => setOpenFwList(true),
      disabled: !formData.Gateway?.label,
    },
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.locksetEdit.path(queryId),
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
      link: routeProperty.lockset.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <LocksetInfoForm formData={formData} isLoading={isLoading} />
      </FormContainer>
      {/* FW Update list modal  */}
      <CardModal
        icon={fwUpdateIcon}
        headerTitle={t`Lockset FW Update`}
        openModal={openFwList}
        setOpenModal={setOpenFwList}
      >
        <LocksetFwUpdateListModal LocksetNo={queryId} setOpenModal={setOpenFwList} />
      </CardModal>
    </Page>
  )
}

export default LocksetInfo
