import { sendPostRequest } from '../../api/swrConfig'
import { backupScheduleApi } from '../../api/urls'
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
  IBackupScheduleFormData,
  backupScheduleMediaOptions,
  maintenanceBackupScheduleOptions,
} from '../../types/pages/backupSchedule'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../types/pages/common'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import BackupScheduleForm from '../../components/pages/backupSchedule/form/BackupScheduleForm'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to create a Backup BackupSchedule
function CreateBackupSchedule() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IBackupScheduleFormData>({
    Schedule: null,
    BackupName: '',
    BackupDesc: '',
    Media: backupScheduleMediaOptions[0],
    BackupData: maintenanceBackupScheduleOptions[0].value,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)
  // Set default Schedule
  useDefaultScheduleOption<IBackupScheduleFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(backupScheduleApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to backupSchedule list page on success
      navigate(routeProperty.backupSchedule.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.BackupName) {
      errors.BackupName = t`BackupSchedule Name is required`
    }
    if (!formData.Media?.value) {
      errors.Media = t`Media is required`
    }
    if (!formData.Schedule?.value) {
      errors.Schedule = t`Schedule is required`
    }
    if (!formData.BackupData) {
      errors.BackupData = t`Backup Type is required`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // error_toast
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      BackupName: formData.BackupName,
      BackupDesc: formData.BackupDesc,
      ScheduleNo: formData.Schedule?.value,
      Media: Number(formData.Media?.value),
      BackupData: formData.BackupData,
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
      link: routeProperty.backupSchedule.path(),
    },
  ]

  return (
    <Page title={t`Add Backup Schedule`}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <BackupScheduleForm
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
        <Button size="large" color="cancel" link={routeProperty.backupSchedule.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateBackupSchedule
