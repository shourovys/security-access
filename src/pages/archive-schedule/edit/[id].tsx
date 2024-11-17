import { sendPutRequest } from '../../../api/swrConfig'
import { archiveScheduleApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IArchiveScheduleFormData,
  IArchiveScheduleResult,
  archiveScheduleMediaOptions,
} from '../../../types/pages/archiveSchedule'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectOption,
} from '../../../types/pages/common'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import ArchiveScheduleForm from '../../../components/pages/archiveSchedule/form/ArchiveScheduleForm'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to edit a ArchiveSchedule
function EditArchiveSchedule() {
  const navigate = useNavigate()
  // Get the archiveSchedule ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IArchiveScheduleFormData>({
    Schedule: null,
    ArchiveName: '',
    ArchiveDesc: '',
    Media: null,
    UsageBased: null,
    UsagePercent: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the ArchiveSchedule from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IArchiveScheduleResult>>(
    queryId ? archiveScheduleApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { Schedule, ArchiveName, ArchiveDesc, Media, UsageBased, UsagePercent } = data.data

      setFormData({
        Schedule: Schedule
          ? {
              value: Schedule.ScheduleNo.toString(),
              label: Schedule.ScheduleName,
            }
          : null,
        ArchiveName,
        ArchiveDesc: ArchiveDesc || '',
        Media: findSelectOption(archiveScheduleMediaOptions, Media),
        UsageBased: findSelectOption(booleanSelectOption, UsageBased),
        UsagePercent: UsagePercent ? UsagePercent.toString() : '',
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(archiveScheduleApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.archiveScheduleInfo.path(queryId))
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
      link: routeProperty.archiveScheduleInfo.path(queryId),
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
          isLoading={isLoading}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.archiveScheduleInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditArchiveSchedule
