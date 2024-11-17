import { sendPutRequest } from '../../../api/swrConfig'
import { contLockApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import CardModal from '../../../components/HOC/modal/CardModal'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ContLockDiscoverListModal from '../../../components/pages/contLock/ContLockDiscoverListModal/ContLockDiscoverListModal'
import ContLockForm from '../../../components/pages/contLock/form/ContLockForm'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import {
  IContLockDiscoverResult,
  IContLockFormData,
  IContLockResult,
} from '../../../types/pages/contLock'
import { applyIcon, cancelIcon, discoverIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../utils/toast'
import t from '../../../utils/translator'
import validateContLockFormData from '../../../utils/validation/contLock'

// Component to edit a ContLock
function EditContLock() {
  const navigate = useNavigate()
  // Get the contLock ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IContLockFormData>({
    ContLockName: '',
    ContLockDesc: '',
    Partition: null,
    ContGate: null,
    RfAddress: '',
    LockId: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Define state variables for modals view
  const [openDiscoverList, setOpenDiscoverList] = useState(false)
  // Define state variables for sleeted discover
  const [selectedDiscoverId, setSelectedDiscoverId] = useState('')

  // Fetch the details of the ContLock from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IContLockResult>>(
    queryId ? contLockApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { ContLockName, ContLockDesc, Partition, ContGate, RfAddress, LockId } = data.data
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
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Update the form data with selected discover
  const handleSelectDiscover = (_discover: IContLockDiscoverResult) => {
    if (_discover) {
      setOpenDiscoverList(false)
      setSelectedDiscoverId(_discover.LockID)
      setFormData((state) => ({
        ...state,
        RfAddress: _discover.RFAddress,
        LockId: _discover.LockID,
      }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(contLockApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.contLockInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateContLockFormData(formData)

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
      ContLockName: formData.ContLockName,
      ContLockDesc: formData.ContLockDesc,
      PartitionNo: formData.Partition?.value,
      ContGateNo: formData.ContGate?.value,
      RfAddress: parseInt(formData.RfAddress),
      LockId: formData.LockId,
    }
    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: discoverIcon,
      text: t`Discover`,
      onClick: () => setOpenDiscoverList(true),
      disabled: !formData.ContGate?.label,
    },
  ]

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
      link: routeProperty.contLockInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        breadcrumbsActions={breadcrumbsActions}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ContLockForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isLoading={isLoading}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.contLockInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
      {/* ContLock Discover list modal  */}
      <CardModal
        icon={discoverIcon}
        headerTitle={t`ContLock Discover`}
        openModal={openDiscoverList}
        setOpenModal={setOpenDiscoverList}
      >
        <ContLockDiscoverListModal
          ContGateNo={formData.ContGate?.value}
          selectedDiscover={selectedDiscoverId}
          handleSelectDiscover={handleSelectDiscover}
        />
      </CardModal>
    </Page>
  )
}

export default EditContLock
