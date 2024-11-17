import { sendPostRequest } from '../../api/swrConfig'
import { archiveScheduleApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import { useDefaultScheduleOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IArchiveScheduleFormData,
  archiveScheduleMediaOptions,
} from '../../types/pages/archiveSchedule'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  booleanSelectOption,
} from '../../types/pages/common'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import ArchiveScheduleForm from '../../components/pages/archiveSchedule/form/ArchiveScheduleForm'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to create a Archive ArchiveSchedule
function CreateArchiveSchedule() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IArchiveScheduleFormData>({
    Schedule: null,
    ArchiveName: '',
    ArchiveDesc: '',
    Media: archiveScheduleMediaOptions[0],
    UsageBased: booleanSelectOption[0],
    UsagePercent: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)
  // Set default Schedule
  useDefaultScheduleOption<IArchiveScheduleFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(archiveScheduleApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to archiveSchedule list page on success
      navigate(routeProperty.archiveSchedule.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.ArchiveName) {
      errors.ArchiveName = t`ArchiveSchedule Name is required`
    }
    if (!formData.Media?.value) {
      errors.Media = t`Media is required`
    }
    if (formData.UsageBased?.value === '1' && !formData.UsagePercent) {
      errors.UsagePercent = t`Usage Percent is required when Usage Based is disable`
    } else if (formData.UsageBased?.value !== '1' && !formData.Schedule?.value) {
      errors.Schedule = t`Schedule is required when Usage Based is enabled`
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
      ArchiveName: formData.ArchiveName,
      ArchiveDesc: formData.ArchiveDesc,
      ...(formData.UsageBased?.value !== '1' && {
        ScheduleNo: formData.Schedule?.value,
      }),
      ...(formData.UsageBased?.value === '1' && {
        UsagePercent: formData.UsagePercent,
      }),
      Media: Number(formData.Media?.value),
      UsageBased: formData.UsageBased?.value,
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
      link: routeProperty.archiveSchedule.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <ArchiveScheduleForm
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
        <Button size="large" color="cancel" link={routeProperty.archiveSchedule.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateArchiveSchedule
