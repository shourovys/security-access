import { sendPostRequest } from '../../api/swrConfig'
import { miscellaneousApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import MiscellaneousCredentialFormatForm from '../../components/pages/miscellaneous/MiscellaneousCredentialFormatForm'
import MiscellaneousDawnToDuskForm from '../../components/pages/miscellaneous/MiscellaneousDawnToDuskForm'
import MiscellaneousLanguageForm from '../../components/pages/miscellaneous/MiscellaneousLanguageForm'
import MiscellaneousTimeFormatForm from '../../components/pages/miscellaneous/MiscellaneousTimeFormatForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../types/pages/common'
import {
  IMiscellaneousFormData,
  IMiscellaneousResult,
  LanguageOptions,
  bigEndianOptions,
  dateFormatOptions,
  timeFormatOptions,
} from '../../types/pages/miscellaneous'
import { findSelectOption } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../utils/toast'
import useAuth from '../../hooks/useAuth'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to edit Miscellaneous
function EditMiscellaneous() {
  // const navigate = useNavigate()
  const auth = useAuth()

  // Prompt the user before unloading the page if there are unsaved changes
  // useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IMiscellaneousFormData>({
    Language: null,
    DateFormat: null,
    TimeFormat: null,
    Latitude: '',
    Longitude: '',
    BigEndian32: null,
    BigEndian56: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Miscellaneous from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IMiscellaneousResult>>(
    miscellaneousApi.details
  )
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Language, DateFormat, TimeFormat, Latitude, Longitude, BigEndian32, BigEndian56 } =
        data.data
      setFormData({
        Language: findSelectOption(LanguageOptions, Language),
        DateFormat: findSelectOption(dateFormatOptions, DateFormat),
        TimeFormat: findSelectOption(timeFormatOptions, TimeFormat),
        Latitude: Latitude.toString(),
        Longitude: Longitude.toString(),
        BigEndian32: findSelectOption(bigEndianOptions, BigEndian32),
        BigEndian56: findSelectOption(bigEndianOptions, BigEndian56),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(miscellaneousApi.edit, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      auth.refresh()
      // reload the page
      // auth.logout()
      window.location.href = routeProperty.miscellaneousInfo.path() + '?reload=true'
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.DateFormat) {
      errors.DateFormat = t`Date format is required`
    }
    if (!formData.TimeFormat) {
      errors.TimeFormat = t`Time format is required`
    }
    // const latitudeRegex = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/
    // if (!formData.Latitude) {
    //   errors.Latitude = t`Latitude is required`
    // } else if (!latitudeRegex.test(formData.Latitude)) {
    //   errors.Latitude = t`Invalid latitude value`
    // }
    //
    // const longitudeRegex = /^-?((([1-9]|[1-9]\d|1[0-7]\d)\.{1}\d{1,6})|180\.{1}0{1,6})$/
    // if (!formData.Longitude) {
    //   errors.Longitude = t`Longitude is required`
    // } else if (!longitudeRegex.test(formData.Longitude)) {
    //   errors.Longitude = t`Invalid longitude value`
    // }

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
      Language: formData.Language?.value,
      DateFormat: formData.DateFormat?.value,
      TimeFormat: formData.TimeFormat?.value,
      Latitude: formData.Latitude,
      Longitude: formData.Longitude,
      BigEndian32: formData.BigEndian32?.value,
      BigEndian56: formData.BigEndian56?.value,
    }

    trigger(modifiedFormData)
  }

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
      link: routeProperty.miscellaneousInfo.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        pageRoutes={[
          {
            href: routeProperty.miscellaneousInfo.path(),
            text: t`Miscellaneous`,
          },
          {
            href: routeProperty.miscellaneousEdit.path(),
            text: t`Edit`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors}>
        <MiscellaneousLanguageForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        <MiscellaneousTimeFormatForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        <MiscellaneousDawnToDuskForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
        <MiscellaneousCredentialFormatForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color='apply' size='large' onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size='large' color='cancel' link={routeProperty.miscellaneousInfo.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditMiscellaneous
