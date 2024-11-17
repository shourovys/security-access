import { sendPostRequest } from '../../api/swrConfig'
import { credentialApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import CredentialAccessForm from '../../components/pages/credential/form/CredentialAccessForm'
import CredentialForm from '../../components/pages/credential/form/CredentialFrom'
import { useDefaultFormatOption } from '../../hooks/useDefaultOption'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import { INewFormErrors, accessSelectOption, booleanSelectOption } from '../../types/pages/common'
import {
  ICredentialBulkLoadFormData,
  credentialStatsOptions,
  credentialTypesOptions,
} from '../../types/pages/credential'
import { applyIcon, cancelIcon } from '../../utils/icons'
import { bulkEditSuccessfulToast, editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to edit a Credential
function BulkLoadCredential() {
  const navigate = useNavigate()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<ICredentialBulkLoadFormData>({
    Format: null,
    StartCredentialNumb: '',
    BulkCount: '',
    SubKeyNumb: '',
    CredentialType: credentialTypesOptions[0],
    CredentialStat: credentialStatsOptions[0],
    NeverExpired: booleanSelectOption[1],
    StartTime: '',
    EndTime: '',
    CredentialAccessSelect: accessSelectOption[0],
    CredentialGroupIds: [],
    CredentialAccessIds: [],
  })
  const [formErrors, setFormErrors] = useState<INewFormErrors<ICredentialBulkLoadFormData>>({})

  // Set default Format
  useDefaultFormatOption<ICredentialBulkLoadFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(credentialApi.bulkLoad, sendPostRequest, {
    onSuccess: () => {
      bulkEditSuccessfulToast()
      // redirect to schedule list page on success
      navigate(routeProperty.credential.path())
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    const errors: INewFormErrors<ICredentialBulkLoadFormData> = {}

    if (!formData.Format?.value) {
      errors.Format = t`Format is required`
    }
    if (!formData.StartCredentialNumb) {
      errors.StartCredentialNumb = t`Start Credential Number is required`
    }
    if (!formData.BulkCount) {
      errors.BulkCount = t`Bulk Count is required`
    }
    // if (!formData.SubKeyNumb) {
    //   errors.SubKeyNumb = t`Sub Key Number is required`
    // }
    if (!formData.CredentialType?.value) {
      errors.CredentialType = t`Credential Type is required`
    }
    if (!formData.CredentialStat?.value) {
      errors.CredentialStat = t`Credential Stat is required`
    }
    if (!formData.CredentialAccessSelect?.value) {
      errors.CredentialAccessSelect = t`Select Type is required`
    }

    if (formData.NeverExpired?.value === '0') {
      if (!formData.StartTime) {
        errors.StartTime = t`Start Time is required`
      }
      if (!formData.EndTime) {
        errors.EndTime = t`End Time is required`
      }
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
      FormatNo: Number(formData.Format?.value),
      StartCredentialNumb: Number(formData.StartCredentialNumb),
      BulkCount: Number(formData.BulkCount),
      SubKeyNumb: formData.SubKeyNumb,
      CredentialType: Number(formData.CredentialType?.value),
      CredentialStat: Number(formData.CredentialStat?.value),
      NeverExpired: Number(formData.NeverExpired?.value),
      StartTime: formData.StartTime,
      EndTime: formData.EndTime,
      AccessSelect: Number(formData.CredentialAccessSelect?.value),
      GroupIds: formData.CredentialGroupIds,
      AccessIds: formData.CredentialAccessIds,
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
      link: routeProperty.credential.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors}>
        <CredentialForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        <CredentialAccessForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>

      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.credential.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}
export default BulkLoadCredential
