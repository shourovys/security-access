import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { timeApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TimeForm from '../../components/pages/time/TimeForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectOption,
} from '../../types/pages/common'
import { ITimeFormData, ITimeResult } from '../../types/pages/time'
import { findSelectOptionOrDefault } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

// Component to edit Time
function EditTime() {
  const navigate = useNavigate()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<ITimeFormData>({
    Timezone: null,
    Ntp: null,
    CurrentTime: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<ITimeFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch the details of the Time from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ITimeResult>>(timeApi.details)
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Timezone, Ntp, CurrentTime, CurrentTimeZone } = data.data
      setFormData({
        Timezone: Timezone
          ? {
              label: Timezone,
              value: Timezone,
            }
          : null,
        Ntp: findSelectOptionOrDefault(booleanSelectOption, Ntp),
        CurrentTime,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(timeApi.edit, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast('Success')
      navigate(routeProperty.timeInfo.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: INewFormErrors<ITimeFormData> = {}
    if (!formData.Timezone?.value) {
      errors.Timezone = t`Timezone is required`
    }
    if (formData.Ntp && !formData.CurrentTime) {
      errors.CurrentTime = t`Current Time is required`
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
      Timezone: formData.Timezone?.value,
      Ntp: Number(formData.Ntp?.value),
      CurrentTime: formData.CurrentTime,
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
      link: routeProperty.timeInfo.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        // breadcrumbs navbar & router link
        pageRoutes={[
          {
            href: routeProperty.timeInfo.path(),
            text: t`Time`,
          },
          {
            href: routeProperty.timeEdit.path(),
            text: t`Edit`,
          },
        ]}

        //end --rubel
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <TimeForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.timeInfo.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditTime
