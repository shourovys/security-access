import { sendPostRequest } from '../../api/swrConfig'
import { contGateApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import CardModal from '../../components/HOC/modal/CardModal'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import ContGateDiscoverListModal from '../../components/pages/contGate/ContGateDiscoverListModal/ContGateDiscoverListModal'
import ContGateForm from '../../components/pages/contGate/form/ContGateForm'
import { useDefaultNodeOption } from '../../hooks/useDefaultOption'
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
import { IContGateDiscoverResult, IContGateFormData } from '../../types/pages/contGate'
import { applyIcon, cancelIcon, discoverIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import validateContGateFormData from '../../utils/validation/contGate'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to create a ContGate
function CreateContGate() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IContGateFormData>({
    ContGateName: '',
    ContGateDesc: '',
    Node: null,
    MacAddress: '',
    IpAddress: '',
    ApiPort: '',
    SecurityCode: '',
    RfChannel: '',
    SyncCode: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Set default Node
  useDefaultNodeOption<IContGateFormData>(setFormData)

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
  const handleSelectDiscover = (_discover: IContGateDiscoverResult) => {
    if (_discover) {
      setOpenDiscoverList(false)
      setSelectedDiscoverId(_discover.MacAddress)
      setFormData((state) => ({
        ...state,
        MacAddress: _discover.MacAddress,
        IpAddress: _discover.IpAddress,
        ApiPort: _discover.ApiPort,
      }))
    }
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(contGateApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to contGate list page on success
      navigate(routeProperty.contGate.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateContGateFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // error_toast
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      ContGateName: formData.ContGateName,
      ContGateDesc: formData.ContGateDesc,
      NodeNo: formData.Node?.value,
      MacAddress: formData.MacAddress,
      IpAddress: formData.IpAddress,
      ApiPort: parseInt(formData.ApiPort),
      SecurityCode: formData.SecurityCode,
      RfChannel: parseInt(formData.RfChannel),
      SyncCode: formData.SyncCode,
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
      link: routeProperty.contGate.path(),
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
        <ContGateForm
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
        <Button size="large" color="cancel" link={routeProperty.contGate.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
      {/* ContGate Discover list modal  */}
      <CardModal
        icon={discoverIcon}
        headerTitle={t`ContGate Discover`}
        openModal={openDiscoverList}
        setOpenModal={setOpenDiscoverList}
      >
        <ContGateDiscoverListModal
          selectedDiscover={selectedDiscoverId}
          handleSelectDiscover={handleSelectDiscover}
        />
      </CardModal>
    </Page>
  )
}

export default CreateContGate
