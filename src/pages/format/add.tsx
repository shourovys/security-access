import { sendPostRequest } from '../../api/swrConfig'
import { formatApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import CardModal from '../../components/HOC/modal/CardModal'
import Modal from '../../components/HOC/modal/Modal'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import CredentialScanModal from '../../components/pages/credential/CredentialScanModal/CredentialScanModal'
import FormatListModal from '../../components/pages/format/FormatListModal/FormatListModal'
import {
  FormatFacilityNumberForm,
  FormatForm,
  FormatParity1Form,
  FormatParity2Form,
} from '../../components/pages/format/form'
import FormatScanDataForm from '../../components/pages/format/form/FormatScanDataForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useSearchParams } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  booleanSelectOption,
} from '../../types/pages/common'
import {
  IFormatFormData,
  IFormatResult,
  formatTypeOptions,
  parityOptions,
} from '../../types/pages/format'
import { findSelectOption, findSelectOptionOrDefault } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon, formatIcon, scanIcon, selectIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import validateFormatFormData from '../../utils/validation/format'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to create a Format
function CreateFormat() {
  const navigate = useNavigate()
  // Get the CardData from the router query
  const [searchParams] = useSearchParams()
  const queryCardData: string | null = searchParams.get('CardData')
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IFormatFormData>({
    FormatName: '',
    FormatDesc: '',
    DefaultFormat: booleanSelectOption[0],
    BigEndian: null,
    NapcoFormat: null,
    FormatType: formatTypeOptions[0],
    TotalLength: '',
    FacilityCode: '',
    FacilityStart: '',
    FacilityLength: '',
    NumberStart: '',
    NumberLength: '',
    Parity1Type: parityOptions[0],
    Parity1Position: '',
    Parity1Start: '',
    Parity1Length: '',
    Parity2Type: parityOptions[0],
    Parity2Position: '',
    Parity2Start: '',
    Parity2Length: '',
    CardData: '',
    CardNumber: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IFormatFormData>>(
    {},
    scrollToErrorElement
  )

  // Define state variables for modals view
  const [openSelectFormatList, setOpenSelectFormatList] = useState(false)
  const [openScanModal, setOpenScanModal] = useState(false)

  // Define state variables for sleeted format state
  const [selectedFormatID, setSelectedFormatID] = useState('')

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // function for set format data in form data
  const setFormatInFormData = (format: IFormatResult) => {
    const {
      FormatDesc,
      DefaultFormat,
      FormatType,
      BigEndian,
      NapcoFormat,
      TotalLength,
      FacilityCode,
      FacilityStart,
      FacilityLength,
      NumberStart,
      NumberLength,
      Parity1Type,
      Parity1Position,
      Parity1Start,
      Parity1Length,
      Parity2Type,
      Parity2Position,
      Parity2Start,
      Parity2Length,
    } = format
    setFormData((prevState) => ({
      ...prevState,
      FormatDesc: FormatDesc ?? '',
      DefaultFormat: findSelectOption(formatTypeOptions, DefaultFormat),
      BigEndian: findSelectOptionOrDefault(booleanSelectOption, BigEndian),
      NapcoFormat: findSelectOptionOrDefault(booleanSelectOption, NapcoFormat),
      FormatType:
        typeof FormatType === 'number' ? findSelectOption(formatTypeOptions, FormatType) : null,
      TotalLength: TotalLength?.toString() ?? '',
      FacilityCode: FacilityCode?.toString() ?? '',
      FacilityStart: FacilityStart?.toString() ?? '',
      FacilityLength: FacilityLength?.toString() ?? '',
      NumberStart: NumberStart?.toString() ?? '',
      NumberLength: NumberLength?.toString() ?? '',
      Parity1Type:
        typeof Parity1Type === 'number' ? findSelectOption(parityOptions, Parity1Type) : null,
      Parity1Position: Parity1Position?.toString() ?? '',
      Parity1Start: Parity1Start?.toString() ?? '',
      Parity1Length: Parity1Length?.toString() ?? '',
      Parity2Type:
        typeof Parity2Type === 'number' ? findSelectOption(parityOptions, Parity2Type) : null,
      Parity2Position: Parity2Position?.toString() ?? '',
      Parity2Start: Parity2Start?.toString() ?? '',
      Parity2Length: Parity2Length?.toString() ?? '',
    }))
  }

  // Update the form format data with selected format
  const handleSelectedFormat = (format: IFormatResult) => {
    if (format) {
      setOpenSelectFormatList(false)
      setSelectedFormatID(format.FormatNo.toString())
      setFormatInFormData(format)
    }
  }

  // if query card data is present add in state
  useEffect(() => {
    if (queryCardData) {
      handleInputChange('CardData', queryCardData)
    }
  }, [queryCardData])

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(formatApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to format list page on success
      navigate(routeProperty.format.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateFormatFormData(formData)

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
      FormatName: formData.FormatName,
      FormatDesc: formData.FormatDesc,
      DefaultFormat: formData.DefaultFormat?.value,
      BigEndian: formData.BigEndian?.value,
      NapcoFormat: formData.NapcoFormat?.value,
      FormatType: formData.FormatType?.value,
      TotalLength: formData.TotalLength,
      FacilityCode: formData.FacilityCode,
      FacilityStart: formData.FacilityStart,
      FacilityLength: formData.FacilityLength,
      NumberStart: formData.NumberStart,
      NumberLength: formData.NumberLength,
      Parity1Type: formData.Parity1Type?.value,
      Parity1Position: formData.Parity1Position,
      Parity1Start: formData.Parity1Start,
      Parity1Length: formData.Parity1Length,
      Parity2Type: formData.Parity2Type?.value,
      Parity2Position: formData.Parity2Position,
      Parity2Start: formData.Parity2Start,
      Parity2Length: formData.Parity2Length,
    }

    await trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: selectIcon,
      text: t`Format Select`,
      onClick: () => setOpenSelectFormatList(true),
    },
    {
      color: 'danger',
      icon: scanIcon,
      text: t`Scan`,
      onClick: () => setOpenScanModal(true),
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
      link: routeProperty.format.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} sameHeight>
        <FormatForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />

        <FormatFacilityNumberForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />

        <FormatParity1Form
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />

        <FormatParity2Form
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />

        <FormatScanDataForm
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
        <Button size="large" color="cancel" link={routeProperty.format.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
      {/* format list modal  */}
      <CardModal
        icon={formatIcon}
        headerTitle={t`Format Select`}
        openModal={openSelectFormatList}
        setOpenModal={setOpenSelectFormatList}
      >
        <FormatListModal
          selectedFormatId={selectedFormatID}
          handleSelectedFormat={handleSelectedFormat}
        />
      </CardModal>

      {/* credential scan modal  */}
      <Modal openModal={openScanModal} setOpenModal={setOpenScanModal}>
        <CredentialScanModal
          setFormatFormData={setFormData}
          setOpenModal={setOpenScanModal}
          modelTitle={t`Format Scan`}
        />
      </Modal>
    </Page>
  )
}

export default CreateFormat
