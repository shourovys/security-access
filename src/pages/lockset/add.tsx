import { sendPostRequest } from '../../api/swrConfig'
import { locksetApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import CardModal from '../../components/HOC/modal/CardModal'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import LocksetDiscoverListModal from '../../components/pages/lockset/LocksetDiscoverListModal/LocksetDiscoverListModal'
import { useDefaultGatewayOption, useDefaultPartitionOption } from '../../hooks/useDefaultOption'
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
import { applyIcon, cancelIcon, discoverIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import validateLocksetFormData from '../../utils/validation/lockset'
import LocksetForm from '../../components/pages/lockset/form/LocksetForm'
import { ILocksetDiscoverResult, ILocksetFormData } from '../../types/pages/lockset'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to create a Lockset
function CreateLockset() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<ILocksetFormData>({
    LocksetName: '',
    LocksetDesc: '',
    LinkId: '',
    Name: '',
    Model: '',
    DeviceId: '',
    Partition: null,
    Gateway: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Set default Partition and Gateway
  useDefaultPartitionOption<ILocksetFormData>(setFormData)
  useDefaultGatewayOption<ILocksetFormData>(setFormData)

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
  const handleSelectDiscover = (_discover: ILocksetDiscoverResult) => {
    if (_discover) {
      setOpenDiscoverList(false)
      setSelectedDiscoverId(_discover.linkId)
      setFormData((state) => ({
        ...state,
        LinkId: _discover.linkId,
        Name: _discover.deviceName,
        Model: _discover.modelType,
        DeviceId: _discover.deviceId,
      }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(locksetApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to lockset list page on success
      navigate(routeProperty.lockset.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateLocksetFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      Name: formData.Name,
      LocksetName: formData.LocksetName,
      LocksetDesc: formData.LocksetDesc,
      LinkId: formData.LinkId,
      Model: formData.Model,
      DeviceId: formData.DeviceId,
      PartitionNo: formData.Partition?.value,
      GatewayNo: formData.Gateway?.value,
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
      disabled: !formData.Gateway?.label,
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
      link: routeProperty.lockset.path(),
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
        <LocksetForm
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
        <Button size="large" color="cancel" link={routeProperty.lockset.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
      {/* Lockset Discover list modal  */}
      <CardModal
        icon={discoverIcon}
        headerTitle={t`Lockset Discover`}
        openModal={openDiscoverList}
        setOpenModal={setOpenDiscoverList}
      >
        <LocksetDiscoverListModal
          GatewayNo={formData.Gateway?.value}
          selectedDiscover={selectedDiscoverId}
          handleSelectDiscover={handleSelectDiscover}
        />
      </CardModal>
    </Page>
  )
}

export default CreateLockset
