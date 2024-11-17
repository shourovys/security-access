import { sendPostRequest } from '../../api/swrConfig'
import { personApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import {
  PersonAccessForm,
  PersonDefinedFieldForm,
  PersonOptionForm,
  PersonPersonalForm,
} from '../../components/pages/person/form'
import { useDefaultPartitionOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  accessSelectOption,
} from '../../types/pages/common'
import { IPersonFormData, personThreatOptions } from '../../types/pages/person'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { addSuccessfulToast } from '../../utils/toast'
import validatePersonFormData from '../../utils/validation/person'
import t from '../../utils/translator'

// Component to create a Person
function CreatePerson() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IPersonFormData>({
    Partition: null,
    LastName: '',
    FirstName: '',
    MiddleName: '',
    Email: '',
    ImageFile: '',
    Ada: null,
    Exempt: null,
    Invite: null,
    ThreatLevel: personThreatOptions[0],
    AccessSelect: accessSelectOption[0],
    AccessIds: [],
    GroupIds: [],
    Field1: '',
    Field2: '',
    Field3: '',
    Field4: '',
    Field5: '',
    Field6: '',
    Field7: '',
    Field8: '',
    Field9: '',
    Field10: '',
    Field11: '',
    Field12: '',
    Field13: '',
    Field14: '',
    Field15: '',
    Field16: '',
    Field17: '',
    Field18: '',
    Field19: '',
    Field20: '',
  })

  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IPersonFormData>>(
    {},
    scrollToErrorElement
  )

  // Set default Partition
  useDefaultPartitionOption<IPersonFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(personApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to schedule list page on success
      navigate(routeProperty.person.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission

  const handleSubmit = async () => {
    const errors = validatePersonFormData(formData)

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
      PartitionNo: formData.Partition?.value,
      LastName: formData.LastName,
      FirstName: formData.FirstName,
      MiddleName: formData.MiddleName,
      Email: formData.Email,
      ImageFile: formData.ImageFile,
      Ada: formData.Ada?.value,
      Exempt: formData.Exempt?.value,
      Invite: formData.Invite?.value,
      ThreatLevel: formData.ThreatLevel?.value,
      AccessSelect: formData.AccessSelect?.value,
      AccessIds: formData.AccessIds,
      GroupIds: formData.GroupIds,
      Field1: formData.Field1 || '',
      Field2: formData.Field2 || '',
      Field3: formData.Field3 || '',
      Field4: formData.Field4 || '',
      Field5: formData.Field5 || '',
      Field6: formData.Field6 || '',
      Field7: formData.Field7 || '',
      Field8: formData.Field8 || '',
      Field9: formData.Field9 || '',
      Field10: formData.Field10 || '',
      Field11: formData.Field11 || '',
      Field12: formData.Field12 || '',
      Field13: formData.Field13 || '',
      Field14: formData.Field14 || '',
      Field15: formData.Field15 || '',
      Field16: formData.Field16 || '',
      Field17: formData.Field17 || '',
      Field18: formData.Field18 || '',
      Field19: formData.Field19 || '',
      Field20: formData.Field20 || '',
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
      link: routeProperty.person.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors}>
        <PersonPersonalForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        <PersonDefinedFieldForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        <PersonOptionForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        <PersonAccessForm
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
        <Button size="large" color="cancel" link={routeProperty.person.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreatePerson
