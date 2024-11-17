import { sendPostRequest } from '../../api/swrConfig'
import { contLockApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import CardModal from '../../components/HOC/modal/CardModal'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import ContLockDiscoverListModal from '../../components/pages/contLock/ContLockDiscoverListModal/ContLockDiscoverListModal'
import ContLockForm from '../../components/pages/contLock/form/ContLockForm'
import { useDefaultContGateOption, useDefaultPartitionOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../types/pages/common'
import { IContLockDiscoverResult, IContLockFormData } from '../../types/pages/contLock'
import { applyIcon, cancelIcon, discoverIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import validateContLockFormData from '../../utils/validation/contLock'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to create a ContLock
function CreateContLock() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))
  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IContLockFormData>({
    ContLockName: '',
    ContLockDesc: '',
    Partition: null,
    ContGate: null,
    RfAddress: '',
    LockId: '',
  })

  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Set default Partition and ContGate options
  useDefaultPartitionOption<IContLockFormData>(setFormData)
  useDefaultContGateOption<IContLockFormData>(setFormData)

  // Define state variables for modals view
  const [openDiscoverList, setOpenDiscoverList] = useState(false)
  // Define state variables for sleeted discover
  const [selectedDiscoverId, setSelectedDiscoverId] = useState('')

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
  const { trigger, isMutating } = useSWRMutation(contLockApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to contLock list page on success
      navigate(routeProperty.contLock.path())
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
      link: routeProperty.contLock.path(),
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
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.contLock.path()}>
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

export default CreateContLock
