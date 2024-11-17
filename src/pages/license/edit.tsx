import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { fetcher, sendPostRequest } from '../../api/swrConfig'
import { licenseApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import Modal from '../../components/HOC/modal/Modal'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import LicenseCustomerNotFoundModal from '../../components/pages/license/LicenseCustomerNotFoundModal'
import LicenseCustomerUpdateModal from '../../components/pages/license/LicenseCustomerUpdateModal'
import LicenseForm from '../../components/pages/license/LicenseForm'
import LicenseInformationForm from '../../components/pages/license/LicenseInformationForm'
import useAlert from '../../hooks/useAlert'
import useLogoutMutation from '../../hooks/useLogoutMutation'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectObject,
  booleanSelectOption,
} from '../../types/pages/common'
import {
  IGetLicenseDetailsResult,
  ILicenseDetailsResult,
  ILicenseFormData,
  licenseModelsTypesOptions,
  licenseNodeTypesOptions,
  licenseProductsOptions,
} from '../../types/pages/license'
import { findSelectOption } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon, keyIcon, updateLicenseIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { addSuccessfulToast, editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to edit a License
function EditLicense() {
  const { openAlertDialog } = useAlert()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors and isGetLicenseKeySame
  const [formData, setFormData] = useState<ILicenseFormData>({
    Key: '',
    NodeType: licenseNodeTypesOptions[0],
    Elevator: null,
    Mac: '',
    Product: '',
    Model: '',
    Type: '',
    Options: '',
    OptionsStr: '',
    Oem: '',
    Camera: '',
    Channel: '',
    Lockset: '',
    Facegate: '',
    Subnode: '',
    ContLock: '',
    Intercom: '',
    Licensed: '',
    Eula: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)
  const [isLicenseKeyNotSame, setIsLicenseKeyNotSame] = useState<boolean | null>(null)

  // Define the state for manage customer modal state
  const [openCustomerUpdateModal, setOpenCustomerUpdateModal] = useState<boolean>(false)
  // Define the state for manage customer not found modal state
  const [customerNotFound, setCustomerNotFound] = useState<boolean>(false)

  // Fetch the details of the License from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ILicenseDetailsResult>>(
    licenseApi.details
  )

  const checkKeyChange = (key1: string, key2: string) => {
    if (key1 !== key2) {
      setIsLicenseKeyNotSame(true)
    } else {
      setIsLicenseKeyNotSame(false)
    }
  }

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data?.data.License) {
      const {
        Key,
        NodeType,
        Elevator,
        Mac,
        Product,
        Model,
        Type,
        Options,
        OptionsStr,
        OemName,
        Camera,
        Channel,
        Lockset,
        Facegate,
        Subnode,
        ContLock,
        Intercom,
        Licensed,
        Eula,
      } = data?.data.License

      setFormData({
        Key,
        NodeType: findSelectOption(licenseNodeTypesOptions, NodeType),
        Elevator: findSelectOption(booleanSelectOption, Elevator),
        Mac,
        Product:
          licenseProductsOptions.find((option) => option.value === Product.toString())?.label || '',
        Model:
          licenseModelsTypesOptions.find((option) => option.value === Model.toString())?.label ||
          '',
        Type: Type.toString(),
        Options,
        OptionsStr,
        Oem: OemName,
        Camera: Camera.toString(),
        Channel: Channel.toString(),
        Lockset: Lockset.toString(),
        Facegate: Facegate.toString(),
        Subnode: Subnode.toString(),
        ContLock: ContLock.toString(),
        Intercom: Intercom.toString(),
        Licensed: booleanSelectObject[Licensed],
        Eula: booleanSelectObject[Eula],
      })
    }
  }, [data?.data.License])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    if (name === 'Key' && data?.data.License && typeof value === 'string') {
      checkKeyChange(data?.data.License.Key, value)
    }
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(licenseApi.edit, sendPostRequest, {
    onSuccess: () => {
      // console.log('One success')

      editSuccessfulToast()
      logout()
      // navigate(routeProperty.licenseInfo.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleApply = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.Key) {
      errors.Key = t`License key is required`
    }
    if (!formData.NodeType?.value) {
      errors.NodeType = t`Node Type is required`
    }

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
      Key: formData.Key,
      NodeType: formData.NodeType?.value,
      Elevator: formData.Elevator?.value,
    }
    trigger(modifiedFormData)
  }

  const handleSubmit = () => {
    if (isLicenseKeyNotSame && formData.Key !== '') {
      setOpenCustomerUpdateModal(true)
    } else {
      handleApply()
    }
  }

  const handleCustomerModalApplyCall = (submitCustomerModal = () => {}) => {
    handleApply().then(() => submitCustomerModal())
  }

  const handleCustomerNotFoundApplyCall = () => {
    handleApply()
    setCustomerNotFound(false)
  }

  const handleCustomerNotFound = () => {
    setOpenCustomerUpdateModal(false)
    setCustomerNotFound(true)
  }

  const { logout } = useLogoutMutation()

  // Define the mutation function to get license key state from the server
  const { trigger: getLicenseTrigger, isMutating: getLicenseLoading } = useSWRMutation(
    licenseApi.getLicenseKey,
    fetcher,
    {
      onSuccess: (licenseData: ISingleServerResponse<IGetLicenseDetailsResult>) => {
        addSuccessfulToast(`Get License Key Success`)
        if (licenseData.data.LicenseStatus === 'Invalid') {
          setFormData((formData) => ({ ...formData, Key: '' }))
          openAlertDialog(
            () => window.open(licenseData?.data.LicenseInitUrl, '_blank'),
            t('Failed to Get License Key. Do you want to Create License Key ?')
          )
        } else {
          checkKeyChange(licenseData.data.License.LicenseKey, formData.Key)
          if (licenseData?.data.License) {
            const {
              LicenseKey,
              Mac,
              Product,
              Model,
              Type,
              Options,
              OptionsStr,
              OemName,
              Camera,
              Channel,
              Lockset,
              Facegate,
              Subnode,
              ContLock,
            } = licenseData?.data.License

            setFormData((prevState) => ({
              ...prevState,
              Key: LicenseKey,
              Mac,
              Product:
                licenseProductsOptions.find((option) => option.value === Product.toString())
                  ?.label || '',
              Model:
                licenseModelsTypesOptions.find((option) => option.value === Model.toString())
                  ?.label || '',
              Type: Type.toString(),
              Options,
              OptionsStr,
              Oem: OemName,
              Camera: Camera.toString(),
              Channel: Channel.toString(),
              Lockset: Lockset.toString(),
              Facegate: Facegate.toString(),
              Subnode: Subnode.toString(),
              ContLock: ContLock.toString(),
            }))
          }
        }
        // if (getLicenseData.data.state === 'reassign') {
        //   // open customer update modal
        //   setOpenCustomerUpdateModal(true)
        // } else if (getLicenseData.data.state === 'valid') {
        //   logout()
        // } else if (getLicenseData.data.state === 'invalid') {
        //   // redirect initial license page with Alert Dialog
        //   openAlertDialog(
        //     () => window.open(data?.data.initial_license_url, '_blank'),
        //     'You have no license. Do you want to get license?'
        //   )
        // }
      },

      onError: () => {
        openAlertDialog(
          () => window.open(data?.data.LicenseInitUrl, '_blank'),
          t('Failed to get license. Do you want to create new license?')
        )
      },
    }
  )

  // Define the function to redirect update license page
  const redirectUpdateLicense = () => {
    window.open(data?.data.LicenseUpgradeUrl, '_blank')
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: keyIcon,
      text: t`Get License Key`,
      // onClick: () => getLicenseTrigger({ mac: formData.Mac }),
      onClick: () => getLicenseTrigger(),
      isLoading: getLicenseLoading,
    },
    {
      color: 'danger',
      icon: updateLicenseIcon,
      text: t`Upgrade License`,
      onClick: redirectUpdateLicense,
    },
  ]

  // Define the actions for the breadcrumbs bar
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
      link: routeProperty.licenseInfo.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        // breadcrumbs navbar & router link
        pageRoutes={[
          {
            href: routeProperty.licenseInfo.path(),
            text: t`license`,
          },
          {
            href: routeProperty.licenseEdit.path(),
            text: t`Edit`,
          },
        ]}
        //end --rubel
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} sameHeight twoPart={false}>
        <LicenseForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        <LicenseInformationForm formData={formData} isLoading={isLoading} />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color='apply' size='large' onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size='large' color='cancel' link={routeProperty.licenseInfo.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
      <Modal openModal={openCustomerUpdateModal} setOpenModal={setOpenCustomerUpdateModal}>
        <LicenseCustomerUpdateModal
          setOpenModal={setOpenCustomerUpdateModal}
          submitLicenseData={handleCustomerModalApplyCall}
          isLicenseEditMutate={isMutating}
          handleCustomerNotFound={handleCustomerNotFound}
        />
      </Modal>
      <Modal openModal={customerNotFound} setOpenModal={setCustomerNotFound}>
        <LicenseCustomerNotFoundModal
          setOpenModal={setCustomerNotFound}
          onYes={handleCustomerNotFoundApplyCall}
        />
      </Modal>
    </Page>
  )
}

export default EditLicense
